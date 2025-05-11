import DashboardCalendarClient from "./DashboardCalendarClient";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>
      <DashboardCalendarClient />
    </div>
  );
}