import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Chip,
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

const overdue = [
  { id: "#101", title: "Settlement mismatch", due: "Jan 25" },
  { id: "#108", title: "Webhook retries failing", due: "Jan 26" },
];

const highPriority = [
  { id: "#112", title: "Refund status incorrect", status: "Open" },
];

const inProgress = [
  { id: "#115", title: "Invoice PDF issue" },
  { id: "#118", title: "OTP delay on login" },
];

const StatusRow = ({ label, value, color }) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Typography
        variant="body2"
        color={color ? `${color}.main` : "text.secondary"}
      >
        {label}
      </Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Box>
  );
};

const Dashboard = () => {
  const { accessToken, userDetails } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  const handleGetDashboardData = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt.onrender.com/api/v1/dashboard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

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

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* LEFT: ACTION COLUMN */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* HEADER */}
            <Box>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                Hi! {userDetails?.firstName} 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your actionable tickets
              </Typography>
            </Box>

            {/* OVERDUE */}
            <Paper sx={{ p: 2, borderLeft: "5px solid #d32f2f" }}>
              <Typography fontWeight={600} color="error.main">
                ⛔ Overdue
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {dashboardData?.actionable?.overdue?.map((t) => (
                  <ListItem key={t.id} disableGutters>
                    <ListItemText
                      primary={`${t.ticketNumber} — ${t.title}`}
                      secondary={`Due ${t.deadline}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* HIGH PRIORITY */}
            <Paper sx={{ p: 2, borderLeft: "5px solid #ed6c02" }}>
              <Typography fontWeight={600} color="warning.main">
                🔴 High Priority
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {dashboardData?.actionable?.highPriority?.map((t) => (
                  <ListItem key={t.id} disableGutters>
                    <ListItemText
                      primary={`${t.ticketNumber} — ${t.title}`}
                      secondary={`Due ${t.deadline}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* IN PROGRESS */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600}>🟡 In Progress</Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {dashboardData?.actionable?.inProgress?.map((t) => (
                  <ListItem key={t.id} disableGutters>
                    <ListItemText primary={`${t.ticketNumber} — ${t.title}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT: CONTEXT COLUMN */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* STATUS RADAR */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600}>Ticket Health</Typography>

              <Stack spacing={1} mt={2}>
                <StatusRow
                  label="Open"
                  value={dashboardData?.ticketHealth?.open}
                />
                <StatusRow
                  label="In Progress"
                  value={dashboardData?.ticketHealth?.inProgress}
                />
                <StatusRow
                  label="Blocked"
                  value={dashboardData?.ticketHealth?.blocked}
                  color="error"
                />
                <StatusRow
                  label="Closed"
                  value={dashboardData?.ticketHealth?.closed}
                />
              </Stack>
            </Paper>

            {/* LOAD */}
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={600}>My Load</Typography>
              <Typography variant="body2" color="text.secondary">
                {dashboardData?.load?.assignedCount} assigned tickets
              </Typography>
              <LinearProgress
                variant="determinate"
                value={dashboardData?.load?.capacityPercent || 0}
                sx={{ mt: 1 }}
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

//   const { userDetails } = useAuth();
//   return (
//     <Box p={3}>
//       <Grid container spacing={3}>
//         {/* LEFT: ACTION COLUMN */}
//         <Grid size={{ xs: 12, md: 8 }}>
//           <Stack spacing={3}>
//             {/* HEADER */}
//             <Box>
//               <Typography variant="h5" fontWeight={600}>
//                 Hi! {userDetails.firstName} 👋
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Your actionable tickets
//               </Typography>
//             </Box>

//             {/* OVERDUE */}
//             <Paper sx={{ p: 2, borderLeft: "5px solid #d32f2f" }}>
//               <Typography fontWeight={600} color="error.main">
//                 ⛔ Overdue
//               </Typography>
//               <Divider sx={{ my: 1 }} />
//               <List dense>
//                 {overdue.map((t) => (
//                   <ListItem key={t.id} disableGutters>
//                     <ListItemText
//                       primary={`${t.id} — ${t.title}`}
//                       secondary={`Due ${t.due}`}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>

//             {/* HIGH PRIORITY */}
//             <Paper sx={{ p: 2, borderLeft: "5px solid #ed6c02" }}>
//               <Typography fontWeight={600} color="warning.main">
//                 🔴 High Priority
//               </Typography>
//               <Divider sx={{ my: 1 }} />
//               <List dense>
//                 {highPriority.map((t) => (
//                   <ListItem key={t.id} disableGutters>
//                     <ListItemText
//                       primary={`${t.id} — ${t.title}`}
//                       secondary={t.status}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>

//             {/* IN PROGRESS */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600}>🟡 In Progress</Typography>
//               <Divider sx={{ my: 1 }} />
//               <List dense>
//                 {inProgress.map((t) => (
//                   <ListItem key={t.id} disableGutters>
//                     <ListItemText primary={`${t.id} — ${t.title}`} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Stack>
//         </Grid>

//         {/* RIGHT: CONTEXT COLUMN */}
//         <Grid size={{ xs: 12, md: 4 }}>
//           <Stack spacing={3}>
//             {/* STATUS RADAR */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600}>Ticket Health</Typography>

//               <Stack spacing={1} mt={2}>
//                 <StatusRow label="Open" value={42} />
//                 <StatusRow label="In Progress" value={18} />
//                 <StatusRow label="Blocked" value={3} color="error" />
//                 <StatusRow label="Closed" value={76} />
//               </Stack>
//             </Paper>

//             {/* LOAD */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600}>My Load</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 9 assigned tickets
//               </Typography>
//               <LinearProgress variant="determinate" value={60} sx={{ mt: 1 }} />
//             </Paper>

//             {/* PROJECTS */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600}>Projects</Typography>
//               <Stack spacing={1} mt={1}>
//                 <Chip label="Billing • Active" size="small" />
//                 <Chip label="Auth • Suspended" size="small" color="error" />
//                 <Chip
//                   label="Onboarding • Archived"
//                   size="small"
//                   color="success"
//                 />
//               </Stack>
//             </Paper>

//             {/* EVENTS */}
//             <Paper sx={{ p: 2 }}>
//               <Typography fontWeight={600}>Recent Events</Typography>
//               <List dense>
//                 <ListItem disableGutters>
//                   <ListItemText primary="Ticket #112 assigned to you" />
//                 </ListItem>
//                 <ListItem disableGutters>
//                   <ListItemText primary="Project Auth suspended" />
//                 </ListItem>
//               </List>
//             </Paper>
//           </Stack>
//
