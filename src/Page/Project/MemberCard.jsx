import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProjectMemberCard = ({
  item,
  handleOpenEdit,
  handleDeleteOpen,
}) => {
  if (!item) return null;

  const isGroup = Boolean(item.group);

  const displayName = isGroup
    ? item.group.name
    : `${item.user.firstName} ${item.user.lastName}`;

  const subtitle = isGroup ? "Group" : (item.user.roleName ?? "User");

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={!isGroup ? item.user.logoPath : undefined}>
                {displayName[0]}
              </Avatar>

              <Box>
                <Typography fontWeight={600}>{displayName}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            </Stack>

            <Stack direction={"row"}>
              <Tooltip title="Edit Permissions">
                <IconButton size="small" onClick={() => handleOpenEdit(item)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Member" color="error">
                <IconButton size="small" onClick={() => handleDeleteOpen(item)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Permissions */}
          <Stack direction="row" gap={1} flexWrap="wrap">
            {item.permission.map((perm) => (
              <Chip
                key={perm.key}
                label={perm.key}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>

          {/* Footer */}
          <Typography variant="caption" color="text.secondary">
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
