"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const titles: Record<string, { title: string; subtitle: string }> = {
  student: { title: "Student Portal", subtitle: "Manage your NOC requests" },
  faculty: {
    title: "Faculty Portal",
    subtitle: "Review and approve NOC requests",
  },
  hod: { title: "HOD Portal", subtitle: "Oversee department NOC requests" },
  admin: { title: "Admin Panel", subtitle: "Manage the entire NOC system" },
};

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const def = titles[user?.role || "student"];
  return (
    <header className="header">
      <div>
        <div className="header-title">{title || def.title}</div>
        {(subtitle || def.subtitle) && (
          <div className="header-subtitle">{subtitle || def.subtitle}</div>
        )}
      </div>
      <div className="header-actions">
        <button
          style={{
            background: "#f1f5f9",
            border: "none",
            borderRadius: 8,
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <Bell size={18} />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "6px 12px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              {user?.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                textTransform: "capitalize",
              }}
            >
              {user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
