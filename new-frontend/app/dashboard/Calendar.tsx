"use client";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";

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

const CustomEvent = ({ event }: { event: { title: string; color: string } }) => (
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

export default function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);

  return (
    <div className="h-[600px] w-full bg-white rounded-xl overflow-hidden border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        view={currentView}
        onView={setCurrentView}
        date={currentDate}
        onNavigate={setCurrentDate}
        style={{ height: "100%", border: "none" }}
        components={{ event: CustomEvent }}
        popup
        toolbar
        selectable={false}
      />
    </div>
  );
}