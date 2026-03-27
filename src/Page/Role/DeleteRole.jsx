import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const DeleteRole = ({ open, onClose, handleRefresh }) => {
  const { accessToken } = useAuth();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseUrl}/${apiVersion}/role/${open?.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        handleRefresh(response.data.data);
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("An error occurred while deleting role.");
    }
  };

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
        Delete Role
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body1">
            Are you sure you want to delete <strong>{open?.name}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            This action is irreversible. The role and all the users with this
            role will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRole;
