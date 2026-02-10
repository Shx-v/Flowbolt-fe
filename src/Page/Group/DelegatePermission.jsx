import React, { use } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";

const DelegatePermission = ({
  open,
  onClose,
  users = [],
  permissions = [],
  group,
  handleRefresh,
}) => {
  const { accessToken } = useAuth();
  const validationSchema = Yup.object({
    delegatedToUser: Yup.string().required("User is required"),
    permissions: Yup.array()
      .of(Yup.string())
      .min(1, "At least one permission is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      delegatedToUser: "",
      permissions: [],
      group: group || "",
      project: open?.id || "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleDelegatePermission();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleDelegatePermission = async () => {
    try {
      const response = await axios.post(
        "https://flowbolt.onrender.com/api/v1/project-member/delegate-permissions",
        formik.values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        handleRefresh(
          response.data.data,
          open?.id,
          formik.values.delegatedToUser,
        );
        handleClose();
        formik.resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error delegating permissions:", error);
      toast.error("Failed to delegate permissions. Please try again.");
    }
  };

  return (
    <Dialog open={Boolean(open)} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delegate Permission</DialogTitle>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* Delegated User */}
            <TextField
              select
              label="Delegate To"
              name="delegatedToUser"
              value={formik.values.delegatedToUser}
              onChange={(e) =>
                formik.setFieldValue("delegatedToUser", e.target.value)
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.delegatedToUser &&
                Boolean(formik.errors.delegatedToUser)
              }
              helperText={
                formik.touched.delegatedToUser && formik.errors.delegatedToUser
              }
              fullWidth
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Typography variant="body2">
                    {u.firstName} {u.lastName}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>

            {/* Permissions (multi-select) */}
            <TextField
              select
              slotProps={{
                select: {
                  multiple: true,
                },
              }}
              label="Permissions"
              name="permissions"
              value={formik.values.permissions}
              onChange={(e) =>
                formik.setFieldValue("permissions", e.target.value)
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.permissions && Boolean(formik.errors.permissions)
              }
              helperText={
                formik.touched.permissions && formik.errors.permissions
              }
              fullWidth
            >
              {permissions.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.key}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Delegate
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DelegatePermission;
