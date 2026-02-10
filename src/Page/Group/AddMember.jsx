import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddMember = ({ open, onClose, users = [], onSubmit }) => {
  const validationSchema = Yup.object({
    user: Yup.string().required("User is required"),
  });

  const formik = useFormik({
    initialValues: {
      user: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values.user, resetForm);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Member</DialogTitle>

      <Box component={"form"} onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              name="user"
              label="User"
              select
              value={formik.values.user}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user && Boolean(formik.errors.user)}
              helperText={formik.touched.user && formik.errors.user}
              fullWidth
              autoFocus
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user.username}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddMember;
