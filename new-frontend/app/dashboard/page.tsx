export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {/* Calendar placeholder - replace with a real calendar component later */}
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-4"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span className="text-lg">Your calendar will appear here</span>
          <span className="text-sm text-gray-300 mt-2">(Coming soon: schedule, events, and more!)</span>
        </div>
      </div>
    </div>
  );
} 