import React, { useRef, useState, useMemo } from "react";
import {
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Button,
  Popper,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const MENTION_TRIGGER = /@([a-zA-Z0-9-]*)$/;

const AddComment = ({ ticketId, users = [], onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  /* --------------------------------
     Selection helpers
  --------------------------------- */

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const getTextBeforeCursor = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return "";

    const range = sel.getRangeAt(0).cloneRange();
    range.selectNodeContents(editorRef.current);
    range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
    return range.toString();
  };

  /* --------------------------------
     Input handler
  --------------------------------- */

  const handleInput = () => {
    saveSelection();

    const text = getTextBeforeCursor();
    const match = text.match(MENTION_TRIGGER);

    if (match) {
      setQuery(match[1]);
      setAnchorEl(editorRef.current);
    } else {
      setQuery("");
      setAnchorEl(null);
    }
  };

  /* --------------------------------
     Insert mention
  --------------------------------- */

  const insertMention = (user) => {
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    // Remove "@query"
    range.setStart(
      range.endContainer,
      Math.max(0, range.endOffset - query.length - 1),
    );
    range.deleteContents();

    // Create mention node
    const mention = document.createElement("span");
    mention.textContent = `@${user.username}`;
    mention.setAttribute("data-mention", "true");
    mention.setAttribute("data-user-id", user.id);
    mention.contentEditable = "false";

    mention.style.color = "#1976d2";
    mention.style.fontWeight = "500";

    const space = document.createTextNode(" ");

    range.insertNode(space);
    range.insertNode(mention);

    // Move caret after mention
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.collapse(true);

    sel.removeAllRanges();
    sel.addRange(newRange);

    setQuery("");
    setAnchorEl(null);
  };

  /* --------------------------------
     Build API payload
  --------------------------------- */

  const buildPayload = () => {
    const nodes = Array.from(editorRef.current.childNodes);
    const content = [];

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        content.push({
          type: "text",
          text: node.textContent,
        });
      }

      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.dataset.mention === "true"
      ) {
        content.push({
          type: "mention",
          userId: node.dataset.userId,
          label: node.textContent,
        });
      }
    });

    return {
      ticketId,
      content,
    };
  };

  /* --------------------------------
     Submit
  --------------------------------- */

  const handleSubmit = () => {
    const payload = buildPayload();
    onSubmit?.(payload);

    editorRef.current.innerHTML = "";
    setOpen(false);
  };

  /* --------------------------------
     Filter users
  --------------------------------- */

  const filteredUsers = useMemo(() => {
    if (!query) return [];
    return users.filter((u) =>
      u.username.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, users]);

  /* --------------------------------
     Render
  --------------------------------- */

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX={2}
      >
        <Typography variant="subtitle1" color="text.primary">
          Comments
        </Typography>

        <Tooltip title="Add comment">
          <IconButton onClick={() => setOpen((p) => !p)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {open && (
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="body2"
              component="div"
              sx={{ lineHeight: 1.6 }}
            >
              <Box
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                sx={{
                  minHeight: 80,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  outline: "none",
                  whiteSpace: "pre-wrap",
                }}
              />
            </Typography>

            <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
              <Button
                size="small"
                color="inherit"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button size="small" variant="contained" onClick={handleSubmit}>
                Comment
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <Card sx={{ maxHeight: 240, overflow: "auto" }}>
          {filteredUsers.map((user) => (
            <Box
              key={user.id}
              sx={{ p: 1, cursor: "pointer" }}
              onMouseDown={(e) => e.preventDefault()} // CRITICAL
              onClick={() => insertMention(user)}
            >
              <Typography>@{user.username}</Typography>
            </Box>
          ))}
        </Card>
      </Popper>
    </Stack>
  );
};

export default AddComment;
