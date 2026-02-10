import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  const leader = group.members.find((m) => m.id === group.leader);
  const otherMembers = group.members.filter((m) => m.id !== group.leader);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack>
            <Typography variant="h6" fontWeight={600}>
              {group.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {group.description}
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems="center" spacing={1}>
            <Chip
              label={group?.status}
              color={group?.status === "Active" ? "success" : "error"}
            />
            <IconButton onClick={() => navigate(`/group/${group.id}`)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Stack>
        </Stack>

        {leader && (
          <>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Group Leader
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "primary.50",
                border: "1px solid",
                borderColor: "primary.main",
              }}
            >
              <Avatar>{leader.firstName[0]}</Avatar>

              <Box flex={1}>
                <Typography fontWeight={600}>
                  {leader.firstName} {leader.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  @{leader.username}
                </Typography>
              </Box>

              <Chip
                icon={<StarIcon />}
                label="Leader"
                color="primary"
                size="small"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />
          </>
        )}

        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Members ({otherMembers.length})
        </Typography>

        <Stack direction="row" gap={1} flexWrap="wrap">
          {otherMembers.map((member) => (
            <Tooltip key={member.id} title={`@${member.username}`} arrow>
              <Chip
                avatar={<Avatar>{member.firstName?.[0]}</Avatar>}
                label={`${member.firstName} ${member.lastName}`}
                variant="outlined"
              />
            </Tooltip>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
