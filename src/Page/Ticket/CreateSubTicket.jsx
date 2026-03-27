import {
  Box,
  Drawer,
  MenuItem,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const CreateSubTicket = ({ open, onClose, handleRefresh, ticket, users }) => {
  const { accessToken } = useAuth();
  const [types, setTypes] = useState([]);

  const handleCreateSubTicket = async (values) => {
    try {
      const response = await axios.post(
        `${baseUrl}/${apiVersion}/ticket`,
        {
          project: values.projectId,
          title: values.title,
          description: values.description,
          priority: values.priority,
          type: values.type,
          deadline: values.deadline,
          parentTicket: ticket?.id,
          assignedTo: values.assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data?.status === 201) {
        toast.success("Sub-ticket created successfully");
        handleRefresh(response.data.data);
        handleClose();
      } else {
        toast.error(response.data?.message || "Failed to create sub-ticket");
      }
    } catch (error) {
      console.error("Error creating sub-ticket:", error);
      toast.error("Failed to create sub-ticket");
    }
  };

  const validationSchema = yup.object({
    projectId: yup.string().required("Project ID is required"),
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
    enableReinitialize: true,
    initialValues: {
      projectId: ticket?.project?.id || "",
      title: "",
      description: "",
      priority: "",
      type: "",
      deadline: null,
      assignedTo: "",
    },
    validationSchema,
    onSubmit: handleCreateSubTicket,
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
        <Typography variant="h5">Create Sub Ticket</Typography>

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
            fullWidth
          >
            <MenuItem value="LOW">LOW</MenuItem>
            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
            <MenuItem value="HIGH">HIGH</MenuItem>
            <MenuItem value="CRITICAL">CRITICAL</MenuItem>
          </TextField>

          <TextField
            select
            label="Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
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
            onClick={() => console.log(formik.errors)}
            disabled={formik.isSubmitting}
          >
            Create Sub Ticket
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateSubTicket;
