import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const EditMember = ({ open, onClose, permissions = [], handleRefresh }) => {
  const { accessToken } = useAuth();
  const handleClose = () => {
    onClose();
  };

  const existingPermissionIds = useMemo(() => {
    if (!open?.permission || !permissions?.length) return [];

    const memberPermissionSet = new Set(open.permission.map((p) => p.key));

    return permissions
      .filter((p) => memberPermissionSet.has(p.key))
      .map((p) => p.id);
  }, [open?.permission, permissions]);

  const validationSchema = yup.object({
    permissions: yup
      .array()
      .of(yup.string())
      .min(1, "Select at least one permission"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      permissions: existingPermissionIds,
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdateMember(values);
    },
  });

  const handleUpdateMember = async (values) => {
    try {
      const response = await axios.put(
        `https://flowbolt.onrender.com/api/v1/project-member/${open.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        handleClose();
        handleRefresh(response.data.data, open.id);
      }
    } catch (error) {
      toast.error("Failed to update member permissions.");
      console.error("Error updating member permissions:", error);
    }
  };

  return (
    <Dialog open={Boolean(open)} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Member</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={1}
        >
          <Autocomplete
            multiple
            options={permissions}
            getOptionLabel={(option) => option.key}
            value={permissions.filter((p) =>
              formik.values.permissions.includes(p.id),
            )}
            onChange={(_, selected) => {
              formik.setFieldValue(
                "permissions",
                selected.map((p) => p.id),
              );
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Permissions"
                error={
                  formik.touched.permissions &&
                  Boolean(formik.errors.permissions)
                }
                helperText={
                  formik.touched.permissions && formik.errors.permissions
                }
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={!formik.isValid}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMember;
