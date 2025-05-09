/* CalendarComponent.jsx */
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, getISOWeek } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const events = [
  {
    title: "Computergraphik II",
    start: new Date(2025, 3, 26, 12, 0),
    end: new Date(2025, 3, 26, 14, 0),
    color: "#2a4d69",
    description: "Vorlesung Computergraphik II",
  },
  {
    title: "Übung für Computergraphik II",
    start: new Date(2025, 3, 23, 12, 0),
    end: new Date(2025, 3, 23, 14, 0),
    color: "#4b86b4",
    description: "Übung Computergraphik II",
  },
  {
    title: "Bildverarbeitung II",
    start: new Date(2025, 3, 24, 8, 0),
    end: new Date(2025, 3, 24, 10, 0),
    color: "#2a4d69",
    description: "Vorlesung Bildverarbeitung II",
  },
  {
    title: "Übung für Bildverarbeitung II",
    start: new Date(2025, 3, 22, 10, 0),
    end: new Date(2025, 3, 22, 12, 0),
    color: "#4b86b4",
    description: "Übung Bildverarbeitung II",
  },
  {
    title: "Grundlagen der theoretischen Informatik",
    start: new Date(2025, 3, 23, 14, 0),
    end: new Date(2025, 3, 23, 16, 0),
    color: "#2a4d69",
    description: "Vorlesung Grundlagen der theoretischen Informatik",
  },
  {
    title: "Grundlagen der theoretischen Informatik",
    start: new Date(2025, 3, 25, 14, 0),
    end: new Date(2025, 3, 25, 16, 0),
    color: "#2a4d69",
    description: "Vorlesung Grundlagen der theoretischen Informatik",
  },
  {
    title: "Übung zur Grundlagen der theoretischen Informatik",
    start: new Date(2025, 3, 21, 10, 0),
    end: new Date(2025, 3, 21, 12, 0),
    color: "#4b86b4",
    description: "Übungen zur Grundlagen der theoretischen Informatik",
  },
  {
    title: "Arbeitszeit",
    start: new Date(2025, 3, 24, 12, 0),
    end: new Date(2025, 3, 24, 18, 0),
    color: "#adcbe3",
    description: "Arbeitszeit bei Unternehmen X",
  },
  {
    title: "Arbeitszeit",
    start: new Date(2025, 3, 27, 10, 0),
    end: new Date(2025, 3, 27, 14, 0),
    color: "#adcbe3",
    description: "Arbeitszeit bei Unternehmen X",
  },
];

const CustomEvent = ({ event }) => {
  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: "12px",
        fontSize: "0.85rem",
        fontWeight: 500,
        backgroundColor: event.color,
        color: "#111827",
      }}
    >
      {event.title}
    </div>
  );
};

const getFormattedDate = (date, view) => {
  switch (view) {
    case "month":
      return format(date, "MMMM yyyy");
    case "day":
      return format(date, "MMMM do, yyyy");
    case "week":
      return `KW ${getISOWeek(date)} – ${format(date, "MMMM yyyy")}`;
    default:
      return format(date, "MMMM do, yyyy");
  }
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setCurrentView(newView);
    }
  };

  const handleToday = () => setCurrentDate(new Date());
  const handleNext = () => {
    const next = new Date(currentDate);
    if (currentView === Views.MONTH) next.setMonth(next.getMonth() + 1);
    else if (currentView === Views.WEEK) next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleBack = () => {
    const prev = new Date(currentDate);
    if (currentView === Views.MONTH) prev.setMonth(prev.getMonth() - 1);
    else if (currentView === Views.WEEK) prev.setDate(prev.getDate() - 7);
    else prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: "80vh" }}>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={handleBack}>← Back</Button>
          <Button onClick={handleToday}>Today</Button>
          <Button onClick={handleNext}>Next →</Button>
        </ButtonGroup>

        <div
          style={{
            fontSize: "1.125rem",
            fontWeight: 500,
            color: "#111827",
            textAlign: "center",
            flex: 1,
          }}
        >
          {getFormattedDate(currentDate, currentView)}
        </div>

        <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={handleViewChange}
          size="small"
          color="primary"
        >
          <ToggleButton value={Views.DAY}>Day</ToggleButton>
          <ToggleButton value={Views.WEEK}>Week</ToggleButton>
          <ToggleButton value={Views.MONTH}>Month</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        views={["day", "week", "month"]}
        toolbar={false}
        components={{ event: CustomEvent }}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
        }}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {selectedEvent?.title}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {selectedEvent?.description || "No description available."}
          </Typography>
          {selectedEvent?.start && selectedEvent?.end && (
            <Typography sx={{ mt: 2, fontSize: "0.875rem", color: "gray" }}>
              From {format(selectedEvent.start, "hh:mm a")} to{" "}
              {format(selectedEvent.end, "hh:mm a")}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}
