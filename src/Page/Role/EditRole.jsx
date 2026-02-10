import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

const EditRole = ({ open, onClose, handleRefresh, permissions }) => {
  const { accessToken } = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Role name is required")
      .matches(
        /^[A-Z0-9_]+$/,
        "Role name must be uppercase and use only letters, numbers, and underscores",
      )
      .min(3, "Role name must be at least 3 characters"),

    description: Yup.string()
      .nullable()
      .max(255, "Description must not exceed 255 characters"),

    globalPermissionKeys: Yup.array()
      .of(Yup.string().required())
      .min(1, "At least one permission is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: open?.name,
      description: open?.description,
      globalPermissionKeys: open?.permissions?.map((p) => p.key) || [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      handleEditRole(values);
    },
  });

  const handleClose = () => {
    onClose();
    formik.handleReset();
  };

  const handleEditRole = async (values) => {
    try {
      const response = await axios.put(
        `https://flowbolt.onrender.com/api/v1/role/${open?.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        handleRefresh(response.data.data);
        toast.success(response.data.message);
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to create role:", error);
      toast.error("An error occurred while creating role.");
    }
  };

  return (
    <Drawer open={Boolean(open)} onClose={handleClose} anchor="right">
      <Box width={{ xs: 300, sm: 420 }} padding={2}>
        <Typography variant="h5">Create Ticket</Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={2}
        >
          <TextField
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
          />

          <Autocomplete
            multiple
            options={permissions}
            disableCloseOnSelect
            getOptionLabel={(option) => option.key}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            value={permissions.filter((p) =>
              formik.values.globalPermissionKeys.includes(p.key),
            )}
            onChange={(_, selected) => {
              formik.setFieldValue(
                "globalPermissionKeys",
                selected.map((p) => p.key),
              );
            }}
            onBlur={() => formik.setFieldTouched("globalPermissionKeys", true)}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox checked={selected} sx={{ mr: 1 }} />
                {option.key}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Granted Permissions"
                placeholder="Search permissions"
                error={
                  formik.touched.globalPermissionKeys &&
                  Boolean(formik.errors.globalPermissionKeys)
                }
              />
            )}
          />

          {formik.touched.globalPermissionKeys &&
            formik.errors.globalPermissionKeys && (
              <FormHelperText error>
                {formik.errors.globalPermissionKeys}
              </FormHelperText>
            )}

          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Create Ticket
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditRole;
