"use client"; // TODOEliminate use client from here and put it closer to the subcomponent that needs it
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogOut, Database } from "lucide-react";
import { UserProfile } from "@/components/user-profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen font-sans">
      <aside className="w-56 bg-gray-50 border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8 font-semibold text-lg flex items-center gap-2">
            <span role="img" aria-label="Student">
              👤
            </span>{" "}
            Student
          </div>
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
                  )}
                >
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/job-application"
                  className={cn(
                    "text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
                  )}
                >
                  📄 Job Application
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/data"
                  className={cn(
                    "text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium"
                  )}
                >
                  <Database className="h-5 w-5" /> Data
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="space-y-2">
          <UserProfile />
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 bg-white p-8">{children}</main>
    </div>
  );
}

function LogoutButton() {
  // This must be a client component
  // eslint-disable-next-line @next/next/no-async-client-component

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return (
    <button
      onClick={handleLogout}
      className="mt-8 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium border-t pt-6 w-full justify-center"
    >
      <LogOut className="h-5 w-5" /> Logout
    </button>
  );
}
