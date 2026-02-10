import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useFormik } from "formik";
import React, { use, useEffect, useState } from "react";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddMember = ({
  open,
  onClose,
  handleRefresh,
  data,
  users,
  projectPermissions = [],
}) => {
  const { accessToken } = useAuth();
  const [groups, setGroups] = useState([]);

  const validationSchema = yup.object({
    member: yup.string().required("Selection is required"),
    isGroup: yup.boolean().required(),
    permissions: yup
      .array()
      .of(yup.string())
      .min(1, "Select at least one permission"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      project: data?.id || null,
      member: null,
      isGroup: false,
      permissions: [],
    },
    validationSchema,
    onSubmit: (values) => {
      handleAddMember(values);
    },
  });

  const handleAddMember = async (values) => {
    try {
      const response = await axios.post(
        `https://flowbolt.onrender.com/api/v1/project-member`,
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
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    }
  };

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleGetGroups = async () => {
    try {
      const response = await axios.get(
        `https://flowbolt.onrender.com/api/v1/group/list`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setGroups(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Member</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={1}
        >
          <ToggleButtonGroup
            value={formik.values.isGroup ? "group" : "user"}
            exclusive
            onChange={(e, value) => {
              const isgroup = value === "group";
              formik.setFieldValue("isGroup", isgroup);
              if (isgroup) {
                handleGetGroups();
              }
            }}
            size="small"
          >
            <ToggleButton value="user">Add User</ToggleButton>
            <ToggleButton value="group">Add Group</ToggleButton>
          </ToggleButtonGroup>

          <Autocomplete
            options={formik.values.isGroup ? groups : users}
            getOptionLabel={(option) =>
              formik.values.isGroup
                ? option?.name
                : `${option?.firstName} ${option?.lastName} (${option.username})`
            }
            value={
              formik.values.isGroup
                ? groups.find((g) => g.id === formik.values.member) || null
                : users.find((u) => u.id === formik.values.member) || null
            }
            onChange={(event, value) => {
              formik.setFieldValue("member", value.id);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Member"
                variant="outlined"
                error={formik.touched.member && Boolean(formik.errors.member)}
                helperText={formik.touched.member && formik.errors.member}
              />
            )}
          />

          <Autocomplete
            multiple
            options={projectPermissions}
            getOptionLabel={(option) => option.key}
            value={projectPermissions.filter((p) =>
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
          //   disabled={!formik.isValid || formik.isSubmitting}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMember;
