import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Grow,
  IconButton,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import EditTicket from "./EditTicket";
import AssignTicket from "./AssignTicket";
import CreateSubTicket from "./CreateSubTicket";
import DeleteTicket from "./DeleteTicket";
import { usePopover } from "../../Hook/usePopover";
import CommentSection from "./CommentSection";
import AddCommentDialog from "./AddComment";

const options = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { accessToken, userDetails } = useAuth();
  const priorityPopover = usePopover();
  const navigate = useNavigate();
  const statusPopover = usePopover();
  const [users, setUsers] = useState([]);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [deleteTicketOpen, setDeleteTicketOpen] = useState(false);
  const [assignTicketOpen, setAssignTicketOpen] = useState(false);
  const [selectedStatusIndex, setSelectedStatusIndex] = useState(0);
  const [createSubTicketOpen, setCreateSubTicketOpen] = useState(false);
  const [selectedPriorityIndex, setSelectedPriorityIndex] = useState(0);

  const handleUpdatePriority = async (priority) => {
    try {
      const response = await axios.patch(
        `https://flowbolt.onrender.com/api/v1/ticket/priority`,
        {
          ticketId: ticketDetail?.id,
          priority: priority,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.status === 200) {
        setTicketDetail((prev) => ({ ...prev, priority }));
        toast.success("Priority updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating priority: ", error);
      toast.error("Failed to update priority");
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedPriorityIndex(index);
    priorityPopover.handleClose();
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await axios.patch(
        `https://flowbolt.onrender.com/api/v1/ticket/status`,
        {
          ticketId: ticketDetail?.id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.status === 200) {
        setTicketDetail((prev) => ({ ...prev, status }));
        handleGetTransitions(
          response.data.data.type,
          response.data.data.status,
        );
        setSelectedStatusIndex(0);
        toast.success("Status updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status: ", error);
      toast.error("Failed to update status");
    }
  };

  const handleStatusMenuClick = (event, index) => {
    setSelectedStatusIndex(index);
    statusPopover.handleClose();
  };

  const handleDeleteTicketClose = () => {
    setDeleteTicketOpen(false);
  };

  const handleDeleteTicketOpen = () => {
    setDeleteTicketOpen(true);
  };

  const handleCreateSubTicketClose = () => {
    setCreateSubTicketOpen(false);
  };

  const handleCreateSubTicketOpen = () => {
    setCreateSubTicketOpen(true);
  };

  const handleAssignTicketClose = () => {
    setAssignTicketOpen(false);
  };

  const handleAssignTicketOpen = () => {
    setAssignTicketOpen(true);
  };

  const handleEditTicketOpen = () => {
    setEditTicketOpen(true);
  };

  const handleEditTicketClose = () => {
    setEditTicketOpen(false);
  };

  const handleGetTicketDetails = async (ticketId) => {
    try {
      const response = await axios.get(
        `https://flowbolt.onrender.com/api/v1/ticket/details/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.status === 200) {
        setTicketDetail(response.data.data);
        handleGetTransitions(
          response.data.data?.type,
          response.data.data?.status,
        );
        handleGetMembers(response.data.data?.project?.id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to fetch project details");
    }
  };

  const handleRefreshChildrenTickets = async (ticket) => {
    setTicketDetail(({ subTickets, ...rest }) => ({
      ...rest,
      subTickets: [...subTickets, ticket],
    }));
  };

  const handleRefreshOnEdit = (updatedTicket) => {
    setTicketDetail(({ subTickets, comments, ...rest }) => ({
      subTickets,
      comments,
      ...updatedTicket,
    }));
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
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const handleGetMembers = async (id) => {
    try {
      const response = await axios.get(
        `https://flowbolt.onrender.com/api/v1/project-member/members/${id}`,
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

  const handleGetTransitions = async (type, status) => {
    try {
      const response = await axios.get(
        `https://flowbolt.onrender.com/api/v1/ticket/status-transitions/${type}/${status}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data.success) {
        setStatusOptions(response.data.data?.nextStatusOptions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch status options:", error);
      toast.error("An error occurred while fetching status options.");
    }
  };

  const handleCreateComment = async (value) => {
    try {
      const response = await axios.post(
        `https://flowbolt.onrender.com/api/v1/comment`,
        value,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setTicketDetail((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            comments: [...(prev.comments || []), response.data.data],
          };
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("An error occurred while adding comment.");
    }
  };

  useEffect(() => {
    handleGetTicketDetails(ticketId);
  }, [ticketId]);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            to="/ticket"
            underline="none"
            color="inherit"
          >
            <Typography variant="h5">Tickets</Typography>
          </Link>

          <Typography color="text.primary" fontWeight={500}>
            {ticketDetail?.title ?? "Ticket Details"}
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateSubTicketOpen}
          disabled={
            !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
          }
        >
          Create Sub Ticket
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Ticket Code :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.ticketCode ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Project :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.project?.name ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Priority :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.priority ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Type :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.type ?? "N/A"}
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
                {ticketDetail?.status ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Assigned To :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.assignedTo
                  ? `${ticketDetail.assignedTo.firstName} ${ticketDetail.assignedTo.lastName}`
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Assigned By :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.assignedBy
                  ? `${ticketDetail.assignedBy.firstName} ${ticketDetail.assignedBy.lastName}`
                  : "N/A"}
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
                {formatDate(ticketDetail?.createdAt) ?? "N/A"}
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
                {formatDate(ticketDetail?.updatedAt) ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
        <Button
          variant="contained"
          disabled={
            !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
          }
          onClick={handleEditTicketOpen}
        >
          Edit Details
        </Button>

        <Button
          variant="contained"
          disabled={
            !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
          }
          onClick={handleAssignTicketOpen}
        >
          {ticketDetail?.assignedTo ? "Reassign" : "Assign"}
        </Button>

        {ticketDetail?.parentTicket && (
          <Button
            variant="contained"
            onClick={() => navigate(`/ticket/${ticketDetail?.parentTicket}`)}
          >
            View Parent Ticket
          </Button>
        )}

        <ButtonGroup variant="contained" ref={priorityPopover.anchorRef}>
          <Button
            onClick={() => handleUpdatePriority(options[selectedPriorityIndex])}
            disabled={
              !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
            }
          >
            {options[selectedPriorityIndex]}
          </Button>
          <Button
            size="small"
            onClick={priorityPopover.handleToggle}
            disabled={
              !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
            }
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>

        <Popper
          sx={{ zIndex: 1 }}
          open={priorityPopover.open}
          anchorEl={priorityPopover.anchorRef.current}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={priorityPopover.handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={option === ticketDetail?.priority}
                        selected={index === selectedPriorityIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        {statusOptions.length !== 0 && (
          <ButtonGroup variant="contained" ref={statusPopover.anchorRef}>
            <Button
              onClick={() =>
                handleUpdateStatus(statusOptions?.[selectedStatusIndex])
              }
              disabled={
                !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
              }
            >
              {statusOptions?.[selectedStatusIndex]}
            </Button>
            <Button
              size="small"
              onClick={statusPopover.handleToggle}
              disabled={
                !ticketDetail || !(ticketDetail?.project?.status === "ACTIVE")
              }
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
        )}

        <Popper
          sx={{ zIndex: 1 }}
          open={statusPopover.open}
          anchorEl={statusPopover.anchorRef.current}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={statusPopover.handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {statusOptions.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={option === ticketDetail?.priority}
                        selected={index === selectedStatusIndex}
                        onClick={(event) => handleStatusMenuClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        {ticketDetail?.active && (
          <Button
            variant="contained"
            disabled={!(ticketDetail?.project?.status === "ACTIVE")}
            onClick={handleDeleteTicketOpen}
          >
            Delete
          </Button>
        )}
      </Stack>

      <Typography color="text.primary">{ticketDetail?.description}</Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ticketDetail?.subTickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <TableCell>{ticket.ticketCode}</TableCell>

                <TableCell>{ticket.title}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={ticket.status}
                    color={statusColor(ticket.status)}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={ticket.priority}
                    color={priorityColor(ticket.priority)}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>{ticket.type}</TableCell>

                <TableCell>
                  {ticket.assignedTo
                    ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                    : "Unassigned"}
                </TableCell>

                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {ticketDetail?.subTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Child Tickets
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddCommentDialog
        ticketId={ticketDetail?.id}
        users={users}
        onSubmit={(payload) => handleCreateComment(payload)}
      />

      <CommentSection comments={ticketDetail?.comments} />

      <EditTicket
        open={editTicketOpen}
        onClose={handleEditTicketClose}
        ticket={ticketDetail}
        handleRefresh={handleRefreshOnEdit}
      />

      <AssignTicket
        open={assignTicketOpen}
        onClose={handleAssignTicketClose}
        ticket={ticketDetail}
        handleRefresh={handleRefreshOnEdit}
        users={users}
      />

      <CreateSubTicket
        open={createSubTicketOpen}
        onClose={handleCreateSubTicketClose}
        handleRefresh={handleRefreshChildrenTickets}
        ticket={ticketDetail}
        users={users}
      />

      <DeleteTicket
        open={deleteTicketOpen}
        onClose={handleDeleteTicketClose}
        data={ticketDetail}
      />
    </Box>
  );
};

export default TicketDetails;
