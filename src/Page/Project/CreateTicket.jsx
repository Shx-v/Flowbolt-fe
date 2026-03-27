import {
  Box,
  Drawer,
  MenuItem,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const CreateTicket = ({ open, onClose, handleRefresh, data, users }) => {
  const { accessToken } = useAuth();
  const [types, setTypes] = useState([]);

  const handleCreateTicket = async (values) => {
    try {
      const response = await axios.post(
        `${baseUrl}/${apiVersion}/ticket`,
        {
          project: data?.id,
          title: values.title,
          description: values.description,
          priority: values.priority,
          type: values.type,
          deadline: values.deadline,
          parentTicket: null,
          assignedTo: values.assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 201 || response.data?.status === 201) {
        toast.success("Ticket created successfully");
        handleRefresh(response.data.data);
        handleClose();
      } else {
        toast.error(response.data?.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

  const validationSchema = yup.object({
    title: yup
      .string()
      .required("Ticket title is required")
      .min(3, "Minimum 3 characters"),
    description: yup
      .string()
      .required("Description is required")
      .min(5, "Minimum 5 characters"),
    priority: yup.string().required("Priority is required"),
    type: yup.string().required("Type is required"),
    deadline: yup.date().required("Deadline is required"),
    assignedTo: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priority: "",
      type: "",
      deadline: null,
      assignedTo: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateTicket(values);
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleGetTicketTypes = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/${apiVersion}/ticket/types`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setTypes(response.data.data);
      } else {
        toast.error("Failed to fetch ticket types");
      }
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      toast.error("Failed to fetch ticket types");
    }
  };

  useEffect(() => {
    handleGetTicketTypes();
  }, []);

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <Box width={420} padding={2}>
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
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
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

          <TextField
            select
            label="Priority"
            name="priority"
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.priority && Boolean(formik.errors.priority)
            }
            helperText={formik.touched.priority && formik.errors.priority}
            fullWidth
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
          </TextField>

          <TextField
            select
            label="Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.type && Boolean(formik.errors.type)
            }
            helperText={formik.touched.type && formik.errors.type}
            fullWidth
          >
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.key}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Deadline"
            value={formik.values.deadline}
            onChange={(value) => {
              formik.setFieldValue("deadline", value);
            }}
            slotProps={{
              textField: {
                name: "deadline",
                fullWidth: true,
                error: formik.touched.deadline && Boolean(formik.errors.deadline),
                helperText: formik.touched.deadline && formik.errors.deadline,
              },
            }}
          />

          <TextField
            select
            label="Assign To"
            name="assignedTo"
            value={formik.values.assignedTo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.assignedTo && Boolean(formik.errors.assignedTo)
            }
            helperText={formik.touched.assignedTo && formik.errors.assignedTo}
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>

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

export default CreateTicket;
