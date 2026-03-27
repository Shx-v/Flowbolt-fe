import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { Link as RouterLink } from "react-router-dom";
import EditProject from "./EditProject";
import ChangeOwner from "./ChangeOwner";
import CreateTicket from "./CreateTicket";
import SuspendProject from "./SuspendProject";
import ArchiveProject from "./ArchiveProject";
import RestoreProject from "./RestoreProject";
import AddMember from "./AddMember";
import { ProjectMemberCard } from "./MemberCard";
import EditMember from "./EditMember";
import DeleteMember from "./DeleteMember";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { accessToken, userDetails } = useAuth();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [changeOwnerOpen, setChangeOwnerOpen] = useState(false);
  const [suspendProjectOpen, setSuspendProjectOpen] = useState(false);
  const [archiveProjectOpen, setArchiveProjectOpen] = useState(false);
  const [restoreProjectOpen, setRestoreProjectOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(null);
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(null);
  const [projectPermissions, setProjectPermissions] = useState([]);
  const [members, setMembers] = useState([]);
  const isAdmin = Boolean(
    userDetails.permissions.find((perm) => perm.key === "ADMIN_ACCESS"),
  );

  const handleDeleteMemberClose = () => {
    setDeleteMemberOpen(null);
  };

  const handleDeleteMemberOpen = (member) => {
    setDeleteMemberOpen(member);
  };

  const handleEditMemberClose = () => {
    setEditMemberOpen(null);
  };

  const handleEditMemberOpen = (member) => {
    setEditMemberOpen(member);
  };

  const handleAddMemberClose = () => {
    setAddMemberOpen(false);
  };

  const handleAddMemberOpen = () => {
    setAddMemberOpen(true);
  };

  const handleCreateTicketClose = () => {
    setCreateTicketOpen(false);
  };

  const handleCreateTicketOpen = () => {
    setCreateTicketOpen(true);
  };

  const handleSuspendProjectClose = () => {
    setSuspendProjectOpen(false);
  };

  const handleSuspendProjectOpen = () => {
    setSuspendProjectOpen(true);
  };

  const handleArchiveProjectClose = () => {
    setArchiveProjectOpen(false);
  };

  const handleArchiveProjectOpen = () => {
    setArchiveProjectOpen(true);
  };

  const handleRestoreProjectOpen = () => {
    setRestoreProjectOpen(true);
  };

  const handleRestoreProjectClose = () => {
    setRestoreProjectOpen(false);
  };

  const handleChangeOwnerOpen = () => {
    setChangeOwnerOpen(true);
  };

  const handleChangeOwnerClose = () => {
    setChangeOwnerOpen(false);
  };

  const handleEditProjectOpen = () => {
    setEditProjectOpen(true);
  };

  const handleEditProjectClose = () => {
    setEditProjectOpen(false);
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

  const handleGetProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.status === 200) {
        setProjectDetails(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to fetch project details");
    }
  };

  const handleGetTickets = async (projectId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/ticket/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.status === 200) {
        setTickets(response.data.data);
        setFilteredTickets(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
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

  const handleGetProjectPermissions = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/project-member/permissions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setProjectPermissions(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching project permissions:", error);
      toast.error("Failed to fetch project permissions");
    }
  };

  const handleGetMembers = async (projectId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/project-member/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.status === 200) {
        setMembers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
      toast.error("An error occurred while fetching members.");
    }
  };

  const handleDeleteMember = async () => {
    try {
      const response = await axios.delete(
        `${baseUrl}/${apiVersion}/project-member/${deleteMemberOpen?.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        handleDeleteMemberClose();
        setMembers((prev) =>
          prev.filter((member) => member.id !== deleteMemberOpen?.id),
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to remove member");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "INITIATED":
        return "info";
      case "IN_PROGRESS":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "error";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const TicketCard = ({ ticket }) => {
    return (
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
          height: "100%",
          transition: "0.2s",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardContent>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" color="text.secondary">
              {ticket.ticketCode}
            </Typography>

            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Title */}
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }} noWrap>
            {ticket.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ticket.description}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          {/* Status & Priority */}
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={ticket.status}
              color={statusColor(ticket.status)}
            />
            <Chip
              size="small"
              label={ticket.priority}
              color={priorityColor(ticket.priority)}
              variant="outlined"
            />
            <Chip size="small" label={ticket.type} variant="outlined" />
          </Stack>

          {/* Footer */}
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const debouncedTicketSearch = (() => {
    let timer;

    return (query, setTickets, delay = 400) => {
      clearTimeout(timer);

      timer = setTimeout(async () => {
        if (!query?.trim()) {
          setTickets(tickets || []);
          return;
        }

        const filteredTicket = tickets.filter(
          (ticket) =>
            ticket.title.toLowerCase().includes(query.toLowerCase()) ||
            ticket.ticketCode.toLowerCase().includes(query.toLowerCase()),
        );

        console.log(filteredTicket);

        setTickets(filteredTicket);
      }, delay);
    };
  })();

  const handleRefreshTickets = (ticket) => {
    setTickets((prev) => [...prev, ticket]);
    setFilteredTickets((prev) => [...prev, ticket]);
  };

  const handleRefreshMembers = (member) => {
    setMembers((prev) => [...prev, member]);
  };

  const handleRefreshMembersPerm = (permissions, memberId) => {
    setMembers((prev) => {
      const updatedMembers = prev.map((member) =>
        member.id === memberId
          ? { ...member, permission: permissions }
          : member,
      );
      return updatedMembers;
    });
  };

  useEffect(() => {
    if (projectId) {
      handleGetProjectDetails(projectId);
      handleGetTickets(projectId);
      handleGetMembers(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    handleGetUsers();
    handleGetProjectPermissions();
  }, []);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            to="/project"
            underline="none"
            color="inherit"
          >
            <Typography variant="h5">Projects</Typography>
          </Link>

          <Typography color="text.primary" fontWeight={500}>
            {projectDetail?.name ?? "Project Details"}
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateTicketOpen}
          disabled={!projectDetail || !(projectDetail?.status === "Active")}
        >
          Create Ticket
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Name :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.name ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Project Code :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.projectCode ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Owner :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.owner
                  ? `${projectDetail.owner.firstName} ${projectDetail.owner.lastName}`
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Ticket Count :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {tickets?.length ?? "0"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Created :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {formatDate(projectDetail?.createdAt) ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Updated :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {formatDate(projectDetail?.updatedAt) ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Status :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.status ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Description :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.description ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
        <Button
          variant="contained"
          onClick={handleEditProjectOpen}
          disabled={!projectDetail || !(projectDetail?.status === "Active")}
        >
          Edit Details
        </Button>
        <Button
          variant="contained"
          onClick={handleChangeOwnerOpen}
          disabled={!projectDetail || !(projectDetail?.status === "Active")}
        >
          Change Owner
        </Button>

        <Button
          variant="contained"
          onClick={handleAddMemberOpen}
          disabled={!projectDetail || !(projectDetail?.status === "Active")}
        >
          Add Member
        </Button>

        {projectDetail?.status === "Active" && projectDetail && (
          <Button variant="contained" onClick={handleArchiveProjectOpen}>
            Archive
          </Button>
        )}

        {projectDetail?.status === "Active" && projectDetail && (
          <Button variant="contained" onClick={handleSuspendProjectOpen}>
            Suspend
          </Button>
        )}

        {isAdmin && projectDetail && projectDetail?.status !== "Active" && (
          <Button variant="contained" onClick={handleRestoreProjectOpen}>
            Restore
          </Button>
        )}
      </Stack>

      <Stack>
        <Typography variant="body1" color="text.primary">
          Members
        </Typography>
      </Stack>
      <Grid container spacing={1}>
        {members.map((member, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <ProjectMemberCard
              item={member}
              handleOpenEdit={handleEditMemberOpen}
              handleDeleteOpen={handleDeleteMemberOpen}
            />
          </Grid>
        ))}
      </Grid>

      <Stack padding={2}>
        <TextField
          placeholder="Search by Ticket Name or Code"
          variant="standard"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) =>
            debouncedTicketSearch(e.target.value, setFilteredTickets)
          }
        />
      </Stack>

      {filteredTickets?.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTickets.map((ticket, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={500}
          align="center"
          marginTop={4}
        >
          No Tickets Available
        </Typography>
      )}

      <EditProject
        data={projectDetail}
        open={editProjectOpen}
        onClose={handleEditProjectClose}
        handleRefresh={setProjectDetails}
      />

      <ChangeOwner
        open={changeOwnerOpen}
        onClose={handleChangeOwnerClose}
        handleRefresh={setProjectDetails}
        data={projectDetail}
        users={users}
      />

      <SuspendProject
        open={suspendProjectOpen}
        onClose={handleSuspendProjectClose}
        data={projectDetail}
        handleRefresh={setProjectDetails}
      />

      <ArchiveProject
        open={archiveProjectOpen}
        onClose={handleArchiveProjectClose}
        data={projectDetail}
        handleRefresh={setProjectDetails}
      />

      <RestoreProject
        open={restoreProjectOpen}
        onClose={handleRestoreProjectClose}
        data={projectDetail}
        handleRefresh={setProjectDetails}
      />

      <CreateTicket
        open={createTicketOpen}
        onClose={handleCreateTicketClose}
        data={projectDetail}
        handleRefresh={handleRefreshTickets}
        users={users}
      />

      <AddMember
        open={addMemberOpen}
        onClose={handleAddMemberClose}
        handleRefresh={handleRefreshMembers}
        data={projectDetail}
        users={users}
        projectPermissions={projectPermissions}
      />

      <EditMember
        open={editMemberOpen}
        onClose={handleEditMemberClose}
        permissions={projectPermissions}
        handleRefresh={handleRefreshMembersPerm}
      />

      <DeleteMember
        open={deleteMemberOpen}
        onClose={handleDeleteMemberClose}
        handleDeleteMember={handleDeleteMember}
      />
    </Box>
  );
};

export default ProjectDetails;
