import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen font-sans">
      <aside className="w-56 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8 font-semibold text-lg flex items-center gap-2">
          <span role="img" aria-label="Student">👤</span> Student
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className={cn("text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium")}>📊 Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/job-application" className={cn("text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium")}>📄 Job Application</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-white p-8">{children}</main>
    </div>
  );
} 