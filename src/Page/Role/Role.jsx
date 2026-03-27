import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import RoleCard from "./RoleCard";
import CreateRole from "./CreateRole";
import DeleteRole from "./DeleteRole";
import EditRole from "./EditRole";
import { usePopover } from "../../Hook/usePopover";
import FilterListIcon from "@mui/icons-material/FilterList";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const Role = () => {
  const { accessToken } = useAuth();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [deleteRoleOpen, setDeleteRoleOpen] = useState(null);
  const [editRoleOpen, setEditRoleOpen] = useState(null);
  const [permissions, setPermisiions] = useState([]);

  const handleEditRoleOpen = (role) => {
    setEditRoleOpen(role);
  };

  const handleEditRoleClose = () => {
    setEditRoleOpen(null);
  };

  const handleDeleteRoleOpen = (role) => {
    setDeleteRoleOpen(role);
  };

  const handleDeleteRoleClose = () => {
    setDeleteRoleOpen(null);
  };

  const handleCreateRoleOpen = () => {
    setCreateRoleOpen(true);
  };

  const handleCreateRoleClose = () => {
    setCreateRoleOpen(false);
  };

  const handleGetRoles = async () => {
    try {
      const response = await axios.get(`${baseUrl}/${apiVersion}/role`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setRoles(response.data.data);
        setFilteredRoles(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("An error occurred while fetching roles.");
    }
  };

  const handleRefreshOnCreate = (role) => {
    setRoles((prev) => [...prev, role]);
    setFilteredRoles((prev) => [...prev, role]);
  };

  const handleRefreshOnDelete = (role) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    setFilteredRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  const handleRefreshOnEdit = (role) => {
    setRoles((prev) => [...prev.filter((r) => r.id !== role.id), role]);
    setFilteredRoles((prev) => [...prev.filter((r) => r.id !== role.id), role]);
  };

  const handleGetPermissions = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/role/permission`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setPermisiions(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast.error("An error occurred while fetching permissions.");
    }
  };

  useEffect(() => {
    handleGetRoles();
    handleGetPermissions();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const permissionPopover = usePopover();
  const [permissionSearch, setPermissionSearch] = useState("");

  const filteredPermissions = permissions.filter((p) =>
    p.key.toLowerCase().includes(permissionSearch.toLowerCase()),
  );

  const handlePermissionClose = () => {
    permissionPopover.handleClose();
    setPermissionSearch("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    let data = [...roles];

    // 🔍 Name search
    if (debouncedSearch) {
      data = data.filter((role) =>
        role.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    // 🔐 Permission filter
    if (selectedPermissions.length) {
      data = data.filter((role) =>
        role.permissions?.some((p) => selectedPermissions.includes(p.key)),
      );
    }

    setFilteredRoles(data);
    setPage(1);
  }, [debouncedSearch, selectedPermissions, roles]);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography variant="h5" color="text.primary" fontWeight={500}>
            Roles
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateRoleOpen}
        >
          Add
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <TextField
          label="Search Role"
          placeholder="Search by role name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />

        <Tooltip title="Filter by Permission">
          <IconButton
            ref={permissionPopover.anchorRef}
            onClick={permissionPopover.handleToggle}
            sx={{
              borderRadius: "50%",
              width: 60,
              height: 60,
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Popover
        open={permissionPopover.open}
        anchorEl={permissionPopover.anchorRef.current}
        onClose={handlePermissionClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box width={280} p={2}>
          <TextField
            size="small"
            placeholder="Search permissions"
            value={permissionSearch}
            onChange={(e) => setPermissionSearch(e.target.value)}
            fullWidth
            sx={{ mb: 1.5 }}
          />

          <Stack spacing={0.5} maxHeight={260} overflow="auto">
            {filteredPermissions.map((perm) => {
              const checked = selectedPermissions.includes(perm.key);

              return (
                <Stack
                  key={perm.id}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={() => {
                      setSelectedPermissions((prev) =>
                        checked
                          ? prev.filter((k) => k !== perm.key)
                          : [...prev, perm.key],
                      );
                    }}
                  />
                  <Typography variant="body2">{perm.key}</Typography>
                </Stack>
              );
            })}

            {filteredPermissions.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={1}
              >
                No permissions found
              </Typography>
            )}
          </Stack>
        </Box>
      </Popover>

      <Grid container spacing={2}>
        {filteredRoles
          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
          .map((role, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <RoleCard
                role={role}
                onDelete={() => handleDeleteRoleOpen(role)}
                onEdit={() => handleEditRoleOpen(role)}
              />
            </Grid>
          ))}
      </Grid>

      {filteredRoles.length === 0 ? (
        <Stack justifyContent="center" alignItems="center">
          <Typography color="text.primary">No Roles</Typography>
        </Stack>
      ) : (
        <Stack justifyContent="center" alignItems="center" marginTop={2}>
          <Pagination
            page={page}
            count={
              filteredRoles.length
                ? Math.ceil(filteredRoles.length / rowsPerPage)
                : 1
            }
            onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
            color="primary"
          />
        </Stack>
      )}

      <CreateRole
        open={createRoleOpen}
        onClose={handleCreateRoleClose}
        handleRefresh={handleRefreshOnCreate}
        permissions={permissions}
      />

      <DeleteRole
        open={deleteRoleOpen}
        onClose={handleDeleteRoleClose}
        handleRefresh={handleRefreshOnDelete}
      />

      <EditRole
        open={editRoleOpen}
        onClose={handleEditRoleClose}
        handleRefresh={handleRefreshOnEdit}
        permissions={permissions}
      />
    </Box>
  );
};

export default Role;
