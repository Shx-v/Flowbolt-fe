import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RoleCard = ({ role, onView, onEdit, onDelete }) => {
  if (!role) return null;

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
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          <BadgeIcon color="action" />
          <Typography variant="h6" fontWeight={600} noWrap>
            {role.name}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" minHeight={36}>
          {role.description || "No description provided"}
        </Typography>

        <Box mt={1.5}>
          <Typography variant="caption" color="text.secondary">
            Permissions ({role.permissions?.length})
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap" mt={0.5}>
            {role.permissions?.map((perm) => (
              <Chip
                key={perm.id}
                label={perm.key}
                size="small"
                variant="outlined"
                color={permissionColor(perm.key)}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => onEdit?.(role)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete?.(role)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default RoleCard;
