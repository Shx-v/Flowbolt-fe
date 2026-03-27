import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const ArchiveProject = ({ open, onClose, data, handleRefresh }) => {
  const { accessToken } = useAuth();

  const handleArchive = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/${apiVersion}/project/${data?.id}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Project archived successfully");
        handleRefresh(response.data.data);
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error archiving project:", error);
      toast.error("Failed to archive project");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "success.main" }}>
        Archive Project
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body1">
            Are you sure you want to archive <strong>{data?.name}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            This action marks that all the project work is completed and
            therefore it will be moved to archived projects.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button variant="contained" onClick={handleArchive} color="success">
          Archive
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveProject;
