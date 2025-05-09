import CalendarComponent from "../components/CalendarComponent";

function Dashboard() {
  return (
    <>
      <header
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
        }}
      >
        Schedule
      </header>
      <CalendarComponent />
    </>
  );
}

export default Dashboard;
