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

const RestoreProject = ({ open, onClose, data, handleRefresh }) => {
  const { accessToken } = useAuth();

  const handleRestore = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/${apiVersion}/project/${data?.id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Project restored successfully");
        handleRefresh(response.data.data);
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error restoring project:", error);
      toast.error("Failed to restore project");
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "warning.main" }}>
        Restore Project
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body1">
            Are you sure you want to restore <strong>{data?.name}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            This action will make the project and all it's tickets active.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleRestore}
          color="warning"
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreProject;
