"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { FileText, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

interface Noc {
  _id: string;
  nocId: string;
  studentId: {
    name: string;
    department: string;
    email?: string;
  };
  type: string;
  status: string;
  description?: string;
  createdAt: string;
}

interface Stats {
  [key: string]: unknown;
}

export default function HODDashboard() {
  const [nocs, setNocs] = useState<Noc[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([api.get("/noc"), api.get("/noc/stats")])
      .then(([nocRes, statsRes]) => {
        setNocs(nocRes.data.data);
        setStats(statsRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (
    id: string,
    action: "approved" | "rejected",
    remark: string,
  ) => {
    try {
      await api.patch(`/noc/${id}/approve`, { action, remark });
      toast.success(`NOC ${action}!`);
      setNocs((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: action } : n)),
      );
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  const pending = nocs.filter((n) => n.status === "pending");

  return (
    <DashboardLayout>
      <div>
        <h1 className="page-title">HOD Dashboard</h1>
        <p className="page-subtitle">
          Department-wide NOC oversight and management
        </p>

        <div className="stat-grid">
          {[
            {
              label: "Total NOCs",
              value: nocs.length,
              icon: FileText,
              bg: "#dbeafe",
              color: "#2563eb",
            },
            {
              label: "Pending",
              value: pending.length,
              icon: Clock,
              bg: "#fef3c7",
              color: "#d97706",
            },
            {
              label: "Approved",
              value: nocs.filter((n) => n.status === "approved").length,
              icon: CheckCircle,
              bg: "#dcfce7",
              color: "#16a34a",
            },
            {
              label: "Rejected",
              value: nocs.filter((n) => n.status === "rejected").length,
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

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending for HOD Approval</div>
            </div>
            <Link href="/noc/list" className="btn btn-secondary btn-sm">
              All Requests
            </Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">No pending requests</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>NOC ID</th>
                    <th>Student</th>
                    <th>Type</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((noc) => (
                    <tr key={noc._id}>
                      <td>
                        <span className="noc-id">{noc.nocId}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {noc.studentId?.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          {noc.studentId?.email}
                        </div>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {noc.type}
                      </td>
                      <td>{noc.studentId?.department}</td>
                      <td>{formatDate(noc.createdAt)}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Link
                            href={`/noc/${noc._id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            View
                          </Link>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              handleAction(
                                noc._id,
                                "approved",
                                "Approved by HOD",
                              )
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleAction(
                                noc._id,
                                "rejected",
                                "Rejected by HOD",
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
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
