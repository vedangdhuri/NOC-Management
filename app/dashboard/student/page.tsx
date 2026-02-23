"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Noc {
  _id: string;
  nocId: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  subject?: string;
}

export default function StudentDashboard() {
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

  const stats = {
    total: nocs.length,
    pending: nocs.filter((n) => n.status === "pending").length,
    approved: nocs.filter((n) => n.status === "approved").length,
    rejected: nocs.filter((n) => n.status === "rejected").length,
  };

  return (
    <DashboardLayout>
      <div>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1 className="page-title">Welcome, {user?.name} 👋</h1>
            <p className="page-subtitle">Manage your NOC requests from here</p>
          </div>
          <Link href="/noc/create" className="btn btn-primary">
            <PlusCircle size={18} /> Apply for NOC
          </Link>
        </div>

        <div className="stat-grid">
          {[
            {
              label: "Total Requests",
              value: stats.total,
              icon: FileText,
              bg: "#dbeafe",
              color: "#2563eb",
            },
            {
              label: "Pending",
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
              <div className="card-title">Recent NOC Requests</div>
              <div className="card-subtitle">
                Your latest submitted requests
              </div>
            </div>
            <Link href="/noc/list" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : nocs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <div className="empty-state-text">No NOC requests yet</div>
              <div className="empty-state-sub">
                Click &quot;Apply for NOC&quot; to get started
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {nocs.slice(0, 5).map((noc) => (
                <div key={noc._id} className="noc-card">
                  <div className="noc-card-header">
                    <div>
                      <div className="noc-type">{noc.type}</div>
                      <div className="noc-id">{noc.nocId}</div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span className={`badge badge-${noc.status}`}>
                        {noc.status}
                      </span>
                      {noc.status === "approved" && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/api/pdf/${noc._id}`}
                          target="_blank"
                          className="btn btn-success btn-sm"
                        >
                          <Download size={14} /> PDF
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="noc-desc">{noc.description}</div>
                  <div className="noc-meta">
                    <span>📅 {formatDate(noc.createdAt)}</span>
                    {noc.subject && <span>📚 {noc.subject}</span>}
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
