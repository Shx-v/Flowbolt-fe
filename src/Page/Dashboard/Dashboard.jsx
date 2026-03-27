import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const StatusRow = ({ label, value, color }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography
      variant="body2"
      color={color ? `${color}.main` : "text.secondary"}
    >
      {label}
    </Typography>
    <Typography fontWeight={600}>{value ?? 0}</Typography>
  </Box>
);

const Dashboard = () => {
  const { accessToken, userDetails } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  const handleGetDashboardData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/${apiVersion}/dashboard`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status === 200) {
        setDashboardData(response.data.data);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <Box p={3}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  const { summary, riskMetrics, workload, projectHealth, trends } =
    dashboardData;

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* HEADER */}
            <Box>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                Hi {userDetails?.firstName} 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Overview
              </Typography>
            </Box>

            {/* SUMMARY */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600}>Summary</Typography>
              <Divider sx={{ my: 1 }} />
              <Stack spacing={1}>
                <StatusRow
                  label="Total Projects"
                  value={summary.totalProjects}
                />
                <StatusRow
                  label="Active Projects"
                  value={summary.activeProjects}
                />
                <StatusRow label="Total Tickets" value={summary.totalTickets} />
                <StatusRow label="Open Tickets" value={summary.openTickets} />
                <StatusRow
                  label="Overdue Tickets"
                  value={summary.overdueTickets}
                  color="error"
                />
                <StatusRow
                  label="Blocked Tickets"
                  value={summary.blockedTickets}
                  color="warning"
                />
                <StatusRow
                  label="High Priority Tickets"
                  value={summary.highPriorityTickets}
                />
                <StatusRow
                  label="Resolution Rate"
                  value={`${summary.resolutionRate}%`}
                />
                <StatusRow
                  label="SLA Compliance"
                  value={`${summary.slaComplianceRate}%`}
                />
              </Stack>
            </Paper>

            {/* PROJECT HEALTH */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600}>Project Health</Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {projectHealth?.map((project) => (
                  <ListItem key={project.projectId} disableGutters>
                    <ListItemText
                      primary={`${project.projectName} (${project.projectCode})`}
                      secondary={`Open: ${project.openTickets} • Overdue: ${project.overdueTickets} • Health: ${project.healthScore}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* TICKET TRENDS */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600} mb={2}>
                Ticket Trends (Last 7 Days)
              </Typography>

              {(() => {
                const created = dashboardData?.trends?.last7DaysCreated || [];
                const resolved = dashboardData?.trends?.last7DaysResolved || [];

                if (created.length === 0) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      No trend data available
                    </Typography>
                  );
                }

                const formatDate = (arr) => {
                  const [year, month, day] = arr;
                  return `${day}/${month}`;
                };

                const xAxisData = created.map((d) => formatDate(d.date));
                const createdData = created.map((d) => d.count);
                const resolvedData = resolved.map((d) => d.count);

                return (
                  <LineChart
                    xAxis={[
                      {
                        scaleType: "point",
                        data: xAxisData,
                      },
                    ]}
                    series={[
                      {
                        data: createdData,
                        label: "Created",
                      },
                      {
                        data: resolvedData,
                        label: "Resolved",
                      },
                    ]}
                    height={250}
                    margin={{ top: 20, bottom: 20 }}
                  />
                );
              })()}
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* RISK METRICS PIE */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600} mb={2}>
                Risk Metrics
              </Typography>

              {(() => {
                const { ticketsNearDeadline, ticketsOverdue, agingTickets } =
                  dashboardData?.riskMetrics || {};

                const total =
                  ticketsNearDeadline + ticketsOverdue + agingTickets;

                if (total === 0) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      No risk tickets
                    </Typography>
                  );
                }

                return (
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: ticketsNearDeadline,
                            label: "Near Deadline",
                          },
                          {
                            id: 1,
                            value: ticketsOverdue,
                            label: "Overdue",
                          },
                          {
                            id: 2,
                            value: agingTickets,
                            label: "Aging",
                          },
                        ],
                        innerRadius: 40, // makes it doughnut style
                        outerRadius: 80,
                        paddingAngle: 3,
                        cornerRadius: 4,
                      },
                    ]}
                    // width={280}
                    height={220}
                  />
                );
              })()}
            </Paper>

            {/* BAR CHARTS */}
            <Stack spacing={3} mt={3}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={2}>
                  Tickets by Status
                </Typography>
                <BarChart
                  dataset={
                    dashboardData?.distribution?.byStatus
                      ? Object.entries(dashboardData.distribution.byStatus).map(
                          ([status, count]) => ({ status, Count: count }),
                        )
                      : []
                  }
                  hideLegend
                  xAxis={[
                    {
                      dataKey: "status",
                      position: "none",
                    },
                  ]}
                  yAxis={[{ tickMinStep: 1 }]}
                  series={[{ dataKey: "Count", label: "Tickets" }]}
                  height={250}
                />
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={2}>
                  Tickets by Priority
                </Typography>
                <BarChart
                  dataset={
                    dashboardData?.distribution?.byPriority
                      ? Object.entries(
                          dashboardData.distribution.byPriority,
                        ).map(([priority, count]) => ({
                          priority,
                          Count: count,
                        }))
                      : []
                  }
                  xAxis={[
                    {
                      dataKey: "priority",
                      position: "none",
                    },
                  ]}
                  yAxis={[{ tickMinStep: 1 }]}
                  series={[{ dataKey: "Count", label: "Tickets" }]}
                  height={250}
                />
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={2}>
                  Tickets by Type
                </Typography>
                <BarChart
                  dataset={
                    dashboardData?.distribution?.byType
                      ? Object.entries(dashboardData.distribution.byType).map(
                          ([type, count]) => ({ type, Count: count }),
                        )
                      : []
                  }
                  xAxis={[
                    {
                      dataKey: "type",
                      position: "none",
                    },
                  ]}
                  yAxis={[{ tickMinStep: 1 }]}
                  series={[{ dataKey: "Count", label: "Tickets" }]}
                  height={250}
                />
              </Paper>
            </Stack>

            {/* WORKLOAD */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600}>My Workload</Typography>
              <Stack spacing={1} mt={1}>
                <StatusRow
                  label="Assigned To Me"
                  value={workload.assignedToMe}
                />
                <StatusRow label="Created By Me" value={workload.createdByMe} />
                <StatusRow
                  label="Completed This Week"
                  value={workload.completedByMeThisWeek}
                />
                <StatusRow
                  label="Avg Resolution Time (hrs)"
                  value={workload.averageResolutionTimeHours}
                />
              </Stack>

              <LinearProgress
                variant="determinate"
                value={
                  summary.totalTickets
                    ? (workload.assignedToMe / summary.totalTickets) * 100
                    : 0
                }
                sx={{ mt: 2 }}
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
