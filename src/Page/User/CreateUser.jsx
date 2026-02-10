import {
  Box,
  Button,
  Drawer,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";

const CreateUser = ({ open, onClose, handleRefresh }) => {
  const { accessToken } = useAuth();
  const [roles, setRoles] = useState([]);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters")
      .matches(
        /^[a-zA-Z0-9._-]+$/,
        "Username can contain letters, numbers, ., _, - only",
      ),

    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),

    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[6-9]\d{9}$/, "Invalid phone number"),

    firstName: Yup.string()
      .required("First name is required")
      .max(50, "First name must be at most 50 characters"),

    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Last name must be at most 50 characters"),

    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      role: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateUser(values);
    },
  });

  const handleClose = () => {
    onClose();
    formik.handleReset();
  };

  const handleCreateUser = async (values) => {
    try {
      const response = await axios.post(
        "https://flowbolt.onrender.com/api/v1/auth/register",
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

  const handleGetRoles = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt.onrender.com/api/v1/role",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setRoles(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("An error occurred while fetching roles.");
    }
  };

  useEffect(() => {
    handleGetRoles();
  }, []);

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <Box width={{ xs: 300, sm: 420 }} padding={2}>
        <Typography variant="h5">Create Usser</Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={2}
        >
          <TextField
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            fullWidth
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            required
          />

          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            required
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            fullWidth
            required
          />

          <TextField
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            fullWidth
            required
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            fullWidth
            required
          />

          <TextField
            select
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            fullWidth
            required
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            // disabled={!formik.isValid || formik.isSubmitting}
            onClick={() => console.log(formik.errors)}
          >
            Create User
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateUser;
