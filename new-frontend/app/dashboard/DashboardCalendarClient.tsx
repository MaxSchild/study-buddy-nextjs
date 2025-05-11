"use client";
import dynamic from "next/dynamic";

const DashboardCalendar = dynamic(() => import("./Calendar"), { ssr: false });

export default function DashboardCalendarClient() {
  return <DashboardCalendar />;
} 