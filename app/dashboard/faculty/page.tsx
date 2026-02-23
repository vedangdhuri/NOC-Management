"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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
  description: string;
  createdAt: string;
}

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [nocs, setNocs] = useState<Noc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/noc")
      .then(({ data }) => {
        setNocs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pending = nocs.filter((n) => n.status === "pending");
  const stats = {
    total: nocs.length,
    pending: pending.length,
    approved: nocs.filter((n) => n.status === "approved").length,
    rejected: nocs.filter((n) => n.status === "rejected").length,
  };

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

  return (
    <DashboardLayout>
      <div>
        <h1 className="page-title">Faculty Dashboard</h1>
        <p className="page-subtitle">Review and manage student NOC requests</p>

        <div className="stat-grid">
          {[
            {
              label: "Total NOCs",
              value: stats.total,
              icon: FileText,
              bg: "#dbeafe",
              color: "#2563eb",
            },
            {
              label: "Pending Review",
              value: stats.pending,
              icon: Clock,
              bg: "#fef3c7",
              color: "#d97706",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: CheckCircle,
              bg: "#dcfce7",
              color: "#16a34a",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: XCircle,
              bg: "#fee2e2",
              color: "#dc2626",
            },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <div className="stat-card" key={label}>
              <div className="stat-card-icon" style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div className="stat-card-value">{value}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending NOC Requests</div>
              <div className="card-subtitle">Waiting for your review</div>
            </div>
            <Link href="/noc/list" className="btn btn-secondary btn-sm">
              View All
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
              <div className="empty-state-sub">All caught up!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pending.map((noc) => (
                <div key={noc._id} className="noc-card">
                  <div className="noc-card-header">
                    <div>
                      <div className="noc-type">
                        {noc.type} — {noc.studentId?.name}
                      </div>
                      <div className="noc-id">
                        {noc.nocId} | {noc.studentId?.department}
                      </div>
                    </div>
                    <span className="badge badge-pending">pending</span>
                  </div>
                  <div className="noc-desc">{noc.description}</div>
                  <div className="noc-meta">
                    <span>📅 {formatDate(noc.createdAt)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <Link
                      href={`/noc/${noc._id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Details
                    </Link>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        handleAction(noc._id, "approved", "Approved by faculty")
                      }
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleAction(noc._id, "rejected", "Rejected by faculty")
                      }
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
