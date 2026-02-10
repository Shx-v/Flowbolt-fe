import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteMember = ({ open, onClose, handleDeleteMember }) => {
  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
        Remove Project Member
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body1">
            Are you sure you want to remove{" "}
            <strong>
              {Boolean(open?.group)
                ? open?.group?.name
                : `${open?.user?.firstName} ${open?.user?.lastName}`}
            </strong>
            ?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button variant="contained" color="error" onClick={handleDeleteMember}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMember;
