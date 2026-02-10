import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function CommentSection({ comments = [] }) {
  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [comments]);

  if (!sortedComments.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No comments yet
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {sortedComments.map((comment) => (
        <Card key={comment.id} variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                src={comment.createdBy?.logoPath}
                alt={comment.createdBy?.username}
              />

              <Box flex={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle2">
                    {comment.createdBy?.firstName}{" "}
                    {comment.createdBy?.lastName}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Stack>

                {/* Comment body */}
                <Box mt={1}>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {comment.content?.map((block, index) => {
                      if (block.type === "text") {
                        return (
                          <span key={index}>{block.text}</span>
                        );
                      }

                      if (block.type === "mention") {
                        return (
                          <Link
                            key={index}
                            component={RouterLink}
                            to={`/user/${block.userId}`}
                            underline="hover"
                            sx={{
                              fontWeight: 500,
                              color: "primary.main",
                              mx: 0.25,
                            }}
                          >
                            {block.label}
                          </Link>
                        );
                      }

                      return null;
                    })}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
