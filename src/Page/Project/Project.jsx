import {
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import CircleIcon from "@mui/icons-material/Circle";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import ArchiveIcon from "@mui/icons-material/Archive";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import CreateProject from "./CreateProject";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const Project = () => {
  const { accessToken, userDetails } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const isAdmin = Boolean(
    userDetails.permissions.find((perm) => perm.key === "ADMIN_ACCESS"),
  );

  const handleCreateProjectOpen = () => {
    setCreateProjectOpen(true);
  };

  const handleCreateProjectClose = () => {
    setCreateProjectOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = projects.map((p) => p.id);
      setSelectedProjects(allIds);
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const formatDate = (dateString) => {
    const date = dayjs(dateString);

    const day = date.date();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    return `${date.format("HH:mm")} ${day}${suffix} ${date.format("MMM YYYY")}`;
  };

  const handleGetProjects = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/project`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.status === 200) {
        setProjects(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("An error occurred while fetching projects.");
    }
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/user/list`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.status === 200) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("An error occurred while fetching users.");
    }
  };

  const handleUpdateProjects = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  useEffect(() => {
    handleGetProjects();
    handleGetUsers();
  }, []);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography variant="h5" color="text.primary" fontWeight={500}>
            Projects
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateProjectOpen}
        >
          Add
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: isAdmin ? 4 : 6 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              paddingX: 3,
              paddingY: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "warning.light",
                width: 40,
                height: 40,
              }}
            >
              <TimelapseIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Stack>
              <Typography variant="h5">
                {
                  projects.filter((project) => project.status === "Active")
                    .length
                }
              </Typography>
              <Typography variant="caption">Active Projects</Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: isAdmin ? 4 : 6 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              paddingX: 3,
              paddingY: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "success.main",
                width: 40,
                height: 40,
              }}
            >
              <ArchiveIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Stack>
              <Typography variant="h5">
                {
                  projects.filter((project) => project.status === "Archived")
                    .length
                }
              </Typography>
              <Typography variant="caption">Archieved Projects</Typography>
            </Stack>
          </Card>
        </Grid>
        {isAdmin && (
          <Grid size={{ xs: 12, sm: isAdmin ? 4 : 6 }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                paddingX: 3,
                paddingY: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "error.main",
                  width: 40,
                  height: 40,
                }}
              >
                <DoNotDisturbOnIcon sx={{ fontSize: 24 }} />
              </Avatar>
              <Stack>
                <Typography variant="h5">
                  {
                    projects.filter((project) => project.status === "Suspended")
                      .length
                  }
                </Typography>
                <Typography variant="caption">Suspended Projects</Typography>
              </Stack>
            </Card>
          </Grid>
        )}
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    selectedProjects.length > 0 &&
                    selectedProjects.length === projects.length
                  }
                  indeterminate={
                    selectedProjects.length > 0 &&
                    selectedProjects.length < projects.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Project Code</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Data
                </TableCell>
              </TableRow>
            )}

            {projects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectRow(project.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{project?.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={project?.status} followCursor>
                      <Link
                        component={RouterLink}
                        to={`${project?.id}`}
                        sx={{ cursor: "pointer" }}
                        underline="hover"
                        color={
                          project?.status === "Active"
                            ? "primary"
                            : project?.status === "Archived"
                              ? "success"
                              : "error"
                        }
                      >
                        {project?.projectCode}
                      </Link>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {project?.owner
                      ? `${project.owner.firstName} ${project.owner.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {project?.createdBy?.firstName}{" "}
                    {project?.createdBy?.lastName}
                  </TableCell>
                  <TableCell>{formatDate(project?.createdAt)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {projects.length !== 0 && (
          <TablePagination
            component="div"
            count={projects.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
          />
        )}
      </TableContainer>

      <CreateProject
        open={createProjectOpen}
        onClose={handleCreateProjectClose}
        handleUpdate={handleUpdateProjects}
        users={users}
      />
    </Box>
  );
};

export default Project;
