import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import CreateUser from "./CreateUser";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const User = () => {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [creatUserOpen, setCreateUserOpen] = useState(false);

  const handleCreateUserOpen = () => {
    setCreateUserOpen(true);
  };

  const handleCreateUserClose = () => {
    setCreateUserOpen(false);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/${apiVersion}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("An error occurred while fetching users.");
    }
  };

  const handleRefreshOnCreate = async (user) => {
    setUsers((prev) => [...prev, user]);
  };

  useEffect(() => {
    handleGetUsers();
  }, []);
  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography variant="h5" color="text.primary" fontWeight={500}>
            Users
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateUserOpen}
        >
          Add
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    selectedUsers.length > 0 &&
                    selectedUsers.length === users.length
                  }
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < users.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Data
                </TableCell>
              </TableRow>
            )}

            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectRow(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction={"row"} alignItems={"center"} gap={1.5}>
                      <Avatar
                        src={user?.logoPath}
                        alt="Profile"
                        sx={{ width: 30, height: 30 }}
                      />
                      {user.firstName} {user.lastName}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{user.username}</Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.roleName}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {users.length !== 0 && (
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
          />
        )}
      </TableContainer>

      <CreateUser
        open={creatUserOpen}
        onClose={handleCreateUserClose}
        handleRefresh={handleRefreshOnCreate}
      />
    </Box>
  );
};

export default User;
