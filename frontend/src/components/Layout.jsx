// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import "../App.css";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <aside
        style={{
          width: "220px",
          backgroundColor: "#f9fafb",
          padding: "1.5rem",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <div style={{ marginBottom: "2rem", fontWeight: 600 }}>👤 Student</div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "1rem" }}>
              <a
                href="/dashboard/"
                style={{ textDecoration: "none", color: "#111827" }}
              >
                📊 Dashboard
              </a>
            </li>
            <li
              style={{
                marginBottom: "1rem",
              }}
            >
              <a
                href="/dashboard/job-application"
                style={{ textDecoration: "none", color: "#111827" }}
              >
                📄 Job Application
              </a>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <a
                href="/dashboard/#"
                style={{ textDecoration: "none", color: "#111827" }}
              >
                ✅ To Do
              </a>
            </li>
            <li>
              <a
                href="/dashboard/#"
                style={{ textDecoration: "none", color: "#111827" }}
              >
                ⚙️ Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, backgroundColor: "#ffffff", padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
