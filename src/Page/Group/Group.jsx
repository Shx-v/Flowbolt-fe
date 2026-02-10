import { Box, Breadcrumbs, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../Context/AuthContext";
import GroupCard from "./GroupCard";
import CreateGroup from "./CreateGroup";
import { toast } from "react-toastify";

const Group = () => {
  const { accessToken } = useAuth();
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const handleCreateGroupClose = () => {
    setCreateGroupOpen(false);
  };

  const handleCreateGroupOpen = () => {
    setCreateGroupOpen(true);
  };

  const handleGetGroups = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt.onrender.com/api/v1/group",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("An error occurred while fetching groups.");
    }
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt.onrender.com/api/v1/user/list",
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

  const handleRefreshGroups = (group) => {
    setGroups((prev) => [...prev, group]);
  };

  useEffect(() => {
    handleGetGroups();
    handleGetUsers();
  }, []);

  return (
    <Box padding={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Breadcrumbs>
          <Typography variant="h5" fontWeight={500}>
            Groups
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateGroupOpen}
        >
          Create Group
        </Button>
      </Stack>

      <Stack spacing={2}>
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </Stack>

      {groups.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          mt={2}
        >
          No groups found.
        </Typography>
      )}

      <CreateGroup
        open={createGroupOpen}
        onClose={handleCreateGroupClose}
        handleRefresh={handleRefreshGroups}
        users={users}
      />
    </Box>
  );
};

export default Group;
