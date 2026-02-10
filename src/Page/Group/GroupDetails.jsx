import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Link,
  Stack,
  Tooltip,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import { Link as RouterLink, useParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import AddMember from "./AddMember";
import DelegatePermission from "./DelegatePermission";

const GroupDetails = () => {
  const { groupId } = useParams();
  const { accessToken } = useAuth();
  const [groupDetail, setGroupDetail] = useState(null);
  const [users, setUsers] = useState([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [delegatePermissionOpen, setDelegatePermissionOpen] = useState(null);

  const handleDelegatePermissionClose = () => {
    setDelegatePermissionOpen(null);
  };

  const handleDelegatePermissionOpen = (value) => {
    setDelegatePermissionOpen(value);
  };

  const handleAddMemberClose = () => {
    setAddMemberOpen(false);
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await axios.delete(
        `https://flowbolt.onrender.com/api/v1/group/${groupId}/member/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Member removed successfully");
        setGroupDetail((prev) => ({
          ...prev,
          members: prev.members.filter((m) => m.id !== memberId),
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const handleAddMemberOpen = () => {
    setAddMemberOpen(true);
  };

  const handleGetGroupDetails = async () => {
    try {
      const response = await axios.get(
        `https://flowbolt.onrender.com/api/v1/group/details/${groupId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.data.success) {
        setGroupDetail(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch group details");
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

  const handleAddMember = async (userId, resetForm) => {
    try {
      const response = await axios.post(
        `https://flowbolt.onrender.com/api/v1/group/${groupId}/member`,
        {
          member: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Member added successfully");
        setGroupDetail((prev) => ({
          ...prev,
          members: [...prev.members, response.data.data?.member],
        }));
        resetForm();
        handleAddMemberClose();
      } else {
        toast.error(response.data.message);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    }
  };

  const handleRefreshOnDelegate = (perms, projectId, userId) => {
    setGroupDetail((prev) => {
      const updatedProjects = prev.projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            userPermissions: project.userPermissions.map((user) => {
              if (user.id === userId) {
                return { ...user, permissions: perms };
              }
              return user;
            }),
          };
        }
        return project;
      });

      return { ...prev, projects: updatedProjects };
    });
  };

  useEffect(() => {
    handleGetGroupDetails();
  }, [groupId]);

  useEffect(() => {
    handleGetUsers();
  }, []);

  const { leaderMember, otherMembers } = useMemo(() => {
    if (!groupDetail) return { leaderMember: null, otherMembers: [] };

    return {
      leaderMember: groupDetail.members.find(
        (m) => m.id === groupDetail.leader,
      ),
      otherMembers: groupDetail.members.filter(
        (m) => m.id !== groupDetail.leader,
      ),
    };
  }, [groupDetail]);

  if (!groupDetail) return null;

  return (
    <Box padding={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Breadcrumbs>
          <Link
            component={RouterLink}
            to="/group"
            underline="none"
            color="inherit"
          >
            Groups
          </Link>
          <Typography fontWeight={500}>{groupDetail.name}</Typography>
        </Breadcrumbs>

        <Button startIcon={<AddIcon />} onClick={handleAddMemberOpen}>
          Add Member
        </Button>
      </Stack>

      {/* Group Meta */}
      <Typography variant="h4" fontWeight={600} color="text.primary">
        {groupDetail?.name}
      </Typography>
      <Typography color="text.secondary" mb={1}>
        {groupDetail?.description || "No description provided"}
      </Typography>

      <Chip
        label={groupDetail?.status}
        size="small"
        color={groupDetail?.status === "Active" ? "success" : "default"}
      />

      <Divider sx={{ my: 3 }} />

      {/* Leader */}
      {leaderMember && (
        <Box mb={3}>
          <Typography fontWeight={600} mb={1} color="text.primary">
            Leader
          </Typography>
          <Tooltip title={`@${leaderMember.username}`} arrow>
            <Chip
              avatar={<Avatar>{leaderMember.firstName[0]}</Avatar>}
              label={`${leaderMember.firstName} ${leaderMember.lastName}`}
              color="primary"
              variant="outlined"
            />
          </Tooltip>
        </Box>
      )}

      {/* Members */}
      <Box mb={4}>
        <Typography fontWeight={600} mb={1} color="text.primary">
          Members ({otherMembers.length})
        </Typography>

        <Stack direction="row" gap={1.5} flexWrap="wrap">
          {otherMembers.map((m) => (
            <Tooltip key={m.id} title={`@${m.username}`} arrow>
              <Chip
                avatar={<Avatar>{m.firstName[0]}</Avatar>}
                label={`${m.firstName} ${m.lastName}`}
                variant="outlined"
                onDelete={() => handleRemoveMember(m.id)}
                deleteIcon={<CloseIcon />}
                sx={{
                  "& .MuiChip-deleteIcon": {
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                  },
                  "&:hover .MuiChip-deleteIcon": {
                    opacity: 1,
                  },
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Projects */}
      <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
        Projects
      </Typography>

      <Stack spacing={3}>
        {groupDetail?.projects.map((project) => (
          <Paper key={project.id} variant="outlined" sx={{ p: 2 }}>
            {/* Project Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600}>
                {project.name} ({project.projectCode})
              </Typography>
              <Stack direction={"row"} alignItems="center" spacing={1}>
                <Tooltip title="Delegate permissions" arrow>
                  <IconButton
                    onClick={() => handleDelegatePermissionOpen(project)}
                  >
                    <CenterFocusWeakIcon />
                  </IconButton>
                </Tooltip>
                <Chip
                  label={project.status}
                  size="small"
                  color={project.status === "ACTIVE" ? "success" : "default"}
                />
              </Stack>
            </Stack>

            {/* Project Permissions */}
            <Box mb={2}>
              <Typography variant="subtitle2" mb={0.5}>
                Project Permissions
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {project.permissions.map((perm, index) => (
                  <Chip
                    key={index}
                    label={perm.key}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>

            {/* User Permissions */}
            <Typography variant="subtitle2" mb={1}>
              User Permissions
            </Typography>

            <Stack spacing={1.5}>
              {project.userPermissions
                .filter((user) => user.id !== groupDetail.leader)
                .map((user) => (
                  <Box key={user.id}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={0.5}
                    >
                      <Avatar sx={{ width: 28, height: 28 }}>
                        {user.firstName[0]}
                      </Avatar>
                      <Stack direction={"column"}>
                        <Typography fontWeight={500}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Stack>
                    </Stack>

                    {user.permissions.length === 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        No delegated permissions
                      </Typography>
                    ) : (
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {user.permissions.map((perm, index) => (
                          <Chip
                            key={index}
                            label={perm.key}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}
                  </Box>
                ))}
            </Stack>
          </Paper>
        ))}

        {groupDetail?.projects.length === 0 && (
          <Typography color="text.secondary">
            No projects assigned to this group.
          </Typography>
        )}
      </Stack>

      <AddMember
        open={addMemberOpen}
        onClose={handleAddMemberClose}
        users={users}
        onSubmit={handleAddMember}
      />

      <DelegatePermission
        open={delegatePermissionOpen}
        onClose={handleDelegatePermissionClose}
        users={users}
        permissions={delegatePermissionOpen?.permissions}
        group={groupId}
        handleRefresh={handleRefreshOnDelegate}
      />
    </Box>
  );
};

export default GroupDetails;
