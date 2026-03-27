import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const Ticket = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const rowsPerPage = 6;
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [page, setPage] = useState(1);

  const handleGetTickets = async () => {
    try {
      const response = await axios.get(`${baseUrl}/${apiVersion}/ticket`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status === 200) {
        setTickets(response.data.data);
        setFilteredTickets(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch Tickets:", error);
      toast.error("An error occurred while fetching Tickets.");
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
            <Stack direction={"row"} spacing={1} alignItems="center">
              <Typography variant="subtitle2" color="text.secondary">
                {ticket.ticketCode}
              </Typography>
              {ticket?.active === false && (
                <Tooltip title={"Deleted"}>
                  <CircleIcon fontSize="small" sx={{ color: "red" }} />
                </Tooltip>
              )}
            </Stack>

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

        setPage(1);
        setTickets(filteredTicket);
      }, delay);
    };
  })();

  useEffect(() => {
    handleGetTickets();
  }, []);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography variant="h5" color="text.primary" fontWeight={500}>
            Tickets
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Stack padding={1}>
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

      <Grid container spacing={2}>
        {filteredTickets
          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
          .map((ticket, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
      </Grid>

      {filteredTickets.length === 0 ? (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <Typography color="text.primary">No Tickets</Typography>
        </Stack>
      ) : (
        <Stack justifyContent="center" alignItems="center">
          <Pagination
            page={page}
            count={
              filteredTickets.length
                ? Math.ceil(filteredTickets.length / rowsPerPage)
                : 1
            }
            onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
};

export default Ticket;
