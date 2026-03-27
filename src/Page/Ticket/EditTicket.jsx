import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useMemo } from "react";
import { apiVersion, baseUrl } from "../../Config/EnvironmentConfig";

const EditTicket = ({ open, onClose, handleRefresh, ticket }) => {
  const { accessToken } = useAuth();

  const handleUpdateTicket = async (values) => {
    try {
      const response = await axios.put(
        `${baseUrl}/${apiVersion}/ticket/${ticket?.id}`,
        {
          title: values.title,
          description: values.description,
          deadline: values.deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data?.status === 200) {
        toast.success(response.data?.message || "Ticket updated successfully");
        handleRefresh(response.data?.data);
        handleClose();
      } else {
        toast.error(response.data?.message || "Failed to update ticket");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    }
  };

  const validationSchema = yup.object({
    title: yup.string().required("Title is required").min(3),
    description: yup.string().required("Description is required").min(5),
    deadline: yup.date().required("Deadline is required"),
  });

  const initialValues = useMemo(() => ({
    title: ticket?.title || "",
    description: ticket?.description || "",
    deadline: ticket?.deadline ? dayjs(ticket.deadline) : null,
  }), [ticket]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: handleUpdateTicket,
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Ticket</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={1}
        >
          <TextField
            label="Ticket"
            value={`${ticket?.ticketCode} - ${ticket?.title}`}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            fullWidth
          />

          <TextField
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
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
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
          />

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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Update Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicket;
