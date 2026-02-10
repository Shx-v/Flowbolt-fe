import {
  Box,
  Button,
  Drawer,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateGroup = ({ open, onClose, handleRefresh, users = [] }) => {
  const { accessToken } = useAuth();

  const validationSchema = yup.object({
    name: yup.string().required("Group name is required"),
    description: yup.string().required("Description is required"),
    members: yup
      .array()
      .min(1, "Select at least one member")
      .required("Members are required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      members: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        name: values.name,
        description: values.description,
        members: values.members.map((m) => m.id),
      };
      handleCreateGroup(payload);
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleCreateGroup = async (values) => {
    try {
      const response = await axios.post(
        "https://flowbolt.onrender.com/api/v1/group",
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
        handleRefresh(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box width={420} padding={2}>
        <Typography variant="h6" fontWeight={600}>
          Create Group
        </Typography>

        {/* Form */}
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={2}
        >
          <Stack spacing={2}>
            <TextField
              label="Group Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
            />

            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName} (${option.username})`
              }
              value={formik.values.members}
              onChange={(_, value) => formik.setFieldValue("members", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Members"
                  error={
                    formik.touched.members && Boolean(formik.errors.members)
                  }
                  helperText={formik.touched.members && formik.errors.members}
                />
              )}
            />
          </Stack>
        </Box>

        <Divider />

        {/* Actions */}
        <Box p={2}>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={formik.handleSubmit}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Create Group
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateGroup;
