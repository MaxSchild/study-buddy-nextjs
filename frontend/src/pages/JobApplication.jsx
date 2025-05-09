import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function JobApplication() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://localhost:8000/job-application/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error submitting job application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job-Application.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Tell us what you are looking for.
      </Typography>
      <TextField
        label="Your job preferences"
        multiline
        rows={4}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
      />
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {response && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {response.message}
          </Typography>

          {response.suggestions.map((item, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ mb: 1 }}>{item.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Warum passend?</strong> {item.reason}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default JobApplication;
