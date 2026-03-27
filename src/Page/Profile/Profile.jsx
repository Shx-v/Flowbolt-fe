import React, { useState } from "react";
import { Box, Avatar, Typography, Tabs, Tab, Chip } from "@mui/material";
import { useAuth } from "../../Context/AuthContext";

const Profile = () => {
  const { userDetails } = useAuth();
  console.log(userDetails);
  const [tabIndex, setTabIndex] = useState(0);

  const getGroupFromKey = (key) => {
    if (key.includes("PROJECT_MEMBERS")) return "PROJECT MEMBERS";
    if (key.includes("PROJECT")) return "PROJECT";
    if (key.includes("TICKET")) return "TICKET";
    if (key.includes("COMMENT")) return "COMMENT";
    return "OTHER";
  };

  const groupedPermissions = userDetails.permissions.reduce((acc, perm) => {
    const group = getGroupFromKey(perm.key);

    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);

    return acc;
  }, {});

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      {/* Top user info */}
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        <Avatar
          src={userDetails?.logoPath}
          alt="Avatar"
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography color="text.primary" variant="h5" fontWeight="bold">
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
          <Typography color="text.secondary">
            {userDetails.role.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {userDetails.role.description}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="Profile tabs"
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Account" />
        <Tab label="Role & Permissions" />
      </Tabs>

      {/* Tab Panels */}
      <TabPanel value={tabIndex} index={0}>
        <Box>
          <Typography color="text.primary" variant="h6" gutterBottom>
            Account Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              mt: 2,
            }}
          >
            {/* Username */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Username
              </Typography>
              <Typography color="text.primary">
                {userDetails.username}
              </Typography>
            </Box>

            {/* Email */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography color="text.primary">{userDetails.email}</Typography>
            </Box>

            {/* First Name */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                First Name
              </Typography>
              <Typography color="text.primary">
                {userDetails.firstName}
              </Typography>
            </Box>

            {/* Last Name */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Name
              </Typography>
              <Typography color="text.primary">
                {userDetails.lastName}
              </Typography>
            </Box>

            {/* Phone */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography color="text.primary">
                {userDetails.phoneNumber || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Box>
          {/* Role Section */}
          <Box mb={4}>
            <Typography color="text.primary" variant="h6" gutterBottom>
              Role
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Role Name
            </Typography>
            <Typography color="text.primary" mb={1}>
              {userDetails.role.name}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography color="text.primary">
              {userDetails.role.description}
            </Typography>
          </Box>

          {/* Permissions Section */}
          <Box>
            <Typography color="text.primary" variant="h6" gutterBottom>
              Permissions
            </Typography>

            {Object.entries(groupedPermissions).map(([group, perms]) => {
              // Function to determine chip color
              const permissionColor = (permission) => {
                if (!permission) return "default";
                if (permission.startsWith("CREATE")) return "success";
                if (permission.startsWith("READ")) return "info";
                if (permission.startsWith("UPDATE")) return "warning";
                if (permission.startsWith("DELETE")) return "error";
                if (permission.startsWith("ADMIN")) return "secondary";
                return "default";
              };

              return (
                <Box key={group} mb={3}>
                  {/* Group Title */}
                  <Typography
                    color="text.primary"
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {group}
                  </Typography>

                  {/* Permission Chips */}
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {perms.map((perm) => (
                      <Chip
                        key={perm.key}
                        label={perm.key.replaceAll("_", " ")}
                        variant="outlined"
                        color={permissionColor(perm.key)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Profile;
