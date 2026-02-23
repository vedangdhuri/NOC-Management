"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import {
  FileText,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Noc {
  _id: string;
  nocId: string;
  studentId: {
    name: string;
    department: string;
  };
  type: string;
  status: string;
  createdAt: string;
}

interface Stat {
  _id: string;
  count: number;
}

interface NocStats {
  total: number;
  byStatus: Stat[];
}
export default function AdminDashboard() {
  const [nocs, setNocs] = useState<Noc[]>([]);
  const [userStats, setUserStats] = useState<Stat[]>([]);
  const [nocStats, setNocStats] = useState<NocStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/noc?limit=5"),
      api.get("/users/stats"),
      api.get("/noc/stats"),
    ])
      .then(([nocRes, userRes, statRes]) => {
        setNocs(nocRes.data.data);
        setUserStats(userRes.data.data);
        setNocStats(statRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCount = (role: string) =>
    userStats.find((s) => s._id === role)?.count || 0;
  const getStatusCount = (status: string) =>
    nocStats?.byStatus?.find((s: Stat) => s._id === status)?.count || 0;

  return (
    <DashboardLayout>
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System-wide overview and management</p>

        {/* User Stats */}
        <div style={{ marginBottom: 8 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Users
          </p>
        </div>
        <div className="stat-grid" style={{ marginBottom: 16 }}>
          {[
            {
              label: "Students",
              value: getCount("student"),
              icon: GraduationCap,
              bg: "#dbeafe",
              color: "#2563eb",
              href: "/admin/users?role=student",
            },
            {
              label: "Faculty",
              value: getCount("faculty"),
              icon: Users,
              bg: "#ede9fe",
              color: "#7c3aed",
              href: "/admin/users?role=faculty",
            },
            {
              label: "HODs",
              value: getCount("hod"),
              icon: Users,
              bg: "#fef3c7",
              color: "#d97706",
              href: "/admin/users?role=hod",
            },
            {
              label: "Admins",
              value: getCount("admin"),
              icon: Users,
              bg: "#fce7f3",
              color: "#db2777",
              href: "/admin/users?role=admin",
            },
          ].map(({ label, value, icon: Icon, bg, color, href }) => (
            <Link href={href} key={label} style={{ textDecoration: "none" }}>
              <div
                className="stat-card"
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <div className="stat-card-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <div className="stat-card-value">{loading ? "—" : value}</div>
                <div className="stat-card-label">{label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* NOC Stats */}
        <div style={{ marginBottom: 8 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            NOC Requests
          </p>
        </div>
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            {
              label: "Total NOCs",
              value: nocStats?.total || 0,
              icon: FileText,
              bg: "#f1f5f9",
              color: "#475569",
            },
            {
              label: "Pending",
              value: getStatusCount("pending"),
              icon: Clock,
              bg: "#fef3c7",
              color: "#d97706",
            },
            {
              label: "Approved",
              value: getStatusCount("approved"),
              icon: CheckCircle,
              bg: "#dcfce7",
              color: "#16a34a",
            },
            {
              label: "Rejected",
              value: getStatusCount("rejected"),
              icon: XCircle,
              bg: "#fee2e2",
              color: "#dc2626",
            },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <div className="stat-card" key={label}>
              <div className="stat-card-icon" style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div className="stat-card-value">{loading ? "—" : value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Manage Users",
              sub: "Create, edit, and manage all users",
              href: "/admin/users",
              icon: Users,
              color: "#3b82f6",
            },
            {
              label: "Manage Classes",
              sub: "Add and configure classes",
              href: "/admin/classes",
              icon: GraduationCap,
              color: "#7c3aed",
            },
            {
              label: "Manage Subjects",
              sub: "Assign subjects to faculty",
              href: "/admin/subjects",
              icon: BookOpen,
              color: "#d97706",
            },
            {
              label: "All NOC Requests",
              sub: "Review all NOC submissions",
              href: "/noc/list",
              icon: FileText,
              color: "#16a34a",
            },
          ].map(({ label, sub, href, icon: Icon, color }) => (
            <Link key={label} href={href} style={{ textDecoration: "none" }}>
              <div
                className="card"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent NOCs */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent NOC Requests</div>
            <Link href="/noc/list" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>NOC ID</th>
                    <th>Student</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nocs.map((noc) => (
                    <tr key={noc._id}>
                      <td>
                        <span className="noc-id">{noc.nocId}</span>
                      </td>
                      <td>
                        {noc.studentId?.name}
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          {noc.studentId?.department}
                        </div>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {noc.type}
                      </td>
                      <td>
                        <span className={`badge badge-${noc.status}`}>
                          {noc.status}
                        </span>
                      </td>
                      <td>{formatDate(noc.createdAt)}</td>
                      <td>
                        <Link
                          href={`/noc/${noc._id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
