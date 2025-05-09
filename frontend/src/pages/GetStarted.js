import React from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  TextField,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      university: "",
      files: [],
    },
    onSubmit: async (values) => {
      const formData = new FormData();

      if (values.files.length === 0) {
        alert("Bitte lade mindestens eine Datei hoch.");
        return;
      }

      const nonPDFs = values.files.filter(
        (file) => file.type !== "application/pdf"
      );
      if (nonPDFs.length > 0) {
        alert("Only PDF-Files allowed.");
        return;
      }

      const filenames = values.files.map((file) => file.name);
      const metadata = JSON.stringify({
        filenames,
        university: values.university,
      });

      formData.append("metadata", metadata);
      values.files.forEach((file) => {
        formData.append("files", file);
      });

      setIsLoading(true);
      setSuccess(false);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        console.log("API_URL:", API_URL);

        const response = await fetch(`${API_URL}/getstarted/pdf-geek/`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload fehlgeschlagen");
        }

        await response.json();
        setSuccess(true);
      } catch (error) {
        console.error("Fehler beim Upload:", error);
        alert("Fehler beim Upload.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.currentTarget.files);
    formik.setFieldValue("files", [...formik.values.files, ...selectedFiles]);
  };

  const handleFileRemove = (index) => {
    const newFiles = [...formik.values.files];
    newFiles.splice(index, 1);
    formik.setFieldValue("files", newFiles);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Get started with StudyBuddy
      </Typography>
      <Typography variant="body1" gutterBottom>
        To set up your study plan, select your university and upload the
        relevant documents.
      </Typography>

      {isLoading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : success ? (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Successful Upload!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/dashboard")}
          >
            Continue
          </Button>
        </>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <TextField
            select
            fullWidth
            label="Select university"
            name="university"
            value={formik.values.university}
            onChange={formik.handleChange}
            sx={{ mt: 3 }}
          >
            <MenuItem value="Koblenz University">Universität Koblenz</MenuItem>
            <MenuItem value="Mannheim University">
              Universität Mannheim
            </MenuItem>
          </TextField>

          <Paper
            variant="outlined"
            sx={{
              mt: 3,
              p: 4,
              borderStyle: "dashed",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-file"
              accept="application/pdf"
            />
            <label htmlFor="upload-file">
              <Button component="span">Drag and drop or click to upload</Button>
            </label>
          </Paper>

          <List dense sx={{ mt: 2 }}>
            {formik.values.files.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={file.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleFileRemove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Button variant="contained" sx={{ mt: 4 }} type="submit">
            Continue
          </Button>
        </form>
      )}
    </Box>
  );
};

export default GetStarted;
