"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Download, ArrowLeft, CheckCircle, XCircle, Send } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import Link from "next/link";

interface ApprovalHistoryItem {
  action: string;
  approvedBy?: {
    name: string;
  };
  role: string;
  date: string;
  remark?: string;
}

interface NOCData {
  _id: string;
  nocId: string;
  type: string;
  subject?: string;
  fromDate?: string;
  toDate?: string;
  createdAt: string;
  status: string;
  description: string;
  approvalHistory: ApprovalHistoryItem[];
  studentId?: {
    name: string;
    email: string;
    rollNumber?: string;
    department: string;
    semester?: number;
  };
  classId?: {
    name: string;
  };
}

function ApprovalTimeline({ history }: { history: ApprovalHistoryItem[] }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ padding: "16px 0", color: "#94a3b8", fontSize: 14 }}>
        No approval actions yet.
      </div>
    );
  }
  return (
    <div className="timeline">
      {history.map((h, i) => (
        <div key={i} className="timeline-item">
          <div className={`timeline-dot ${h.action}`} />
          <div className="timeline-title">
            {h.action.charAt(0).toUpperCase() + h.action.slice(1)} by{" "}
            {h.approvedBy?.name || "Unknown"}
            <span
              style={{
                marginLeft: 8,
                fontSize: 11,
                background: "#f1f5f9",
                padding: "2px 6px",
                borderRadius: 4,
                color: "#64748b",
                textTransform: "capitalize",
              }}
            >
              {h.role}
            </span>
          </div>
          <div className="timeline-meta">{formatDateTime(h.date)}</div>
          {h.remark && <div className="timeline-remark">💬 {h.remark}</div>}
        </div>
      ))}
    </div>
  );
}

export default function NOCDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [noc, setNoc] = useState<NOCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState<
    "approved" | "rejected" | null
  >(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    api
      .get(`/noc/${id}`)
      .then(({ data }) => {
        setNoc(data.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("NOC not found");
        router.push("/noc/list");
      });
  }, [id]);

  const handleAction = async (action: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/noc/${id}/approve`, {
        action,
        remark,
      });
      setNoc(data.data);
      toast.success(`NOC ${action}!`);
      setShowRemarkModal(null);
      setRemark("");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const canApprove =
    user &&
    ["faculty", "hod", "admin"].includes(user.role) &&
    noc?.status === "pending";

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex-center" style={{ minHeight: 300 }}>
          <div className="spinner" />
        </div>
      </DashboardLayout>
    );

  if (!noc) return null;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="page-title">NOC Details</h1>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              NOC ID: <code>{noc.nocId}</code>
            </p>
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}
        >
          {/* Main Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">NOC Information</div>
                <span
                  className={`badge badge-${noc.status}`}
                  style={{ fontSize: 13 }}
                >
                  {noc.status.toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  ["Type", noc.type],
                  ["Subject", noc.subject || "—"],
                  ["From Date", noc.fromDate ? formatDate(noc.fromDate) : "—"],
                  ["To Date", noc.toDate ? formatDate(noc.toDate) : "—"],
                  ["Submitted", formatDate(noc.createdAt)],
                  ["Status", noc.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                        textTransform:
                          label === "Type" || label === "Status"
                            ? "capitalize"
                            : "none",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Description
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#334155",
                    lineHeight: 1.7,
                    background: "#f8fafc",
                    padding: 14,
                    borderRadius: 8,
                  }}
                >
                  {noc.description}
                </p>
              </div>
            </div>

            {/* Approval Timeline */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>
                Approval History
              </div>
              <ApprovalTimeline history={noc.approvalHistory} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Student Info */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>
                Student Info
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {noc.studentId?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {noc.studentId?.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {noc.studentId?.email}
                  </div>
                </div>
              </div>
              {[
                ["Roll Number", noc.studentId?.rollNumber || "—"],
                ["Department", noc.studentId?.department],
                [
                  "Semester",
                  noc.studentId?.semester
                    ? `Semester ${noc.studentId.semester}`
                    : "—",
                ],
                ["Class", noc.classId?.name || "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    padding: "8px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <span style={{ color: "#64748b" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            {noc.status === "approved" && (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/api/pdf/${noc._id}`}
                target="_blank"
                className="btn btn-success"
                style={{ justifyContent: "center" }}
              >
                <Download size={18} /> Download NOC PDF
              </a>
            )}

            {canApprove && (
              <div className="card" style={{ border: "1px solid #e2e8f0" }}>
                <div className="card-title" style={{ marginBottom: 12 }}>
                  Take Action
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">Remark (optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Add a remark..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    style={{ minHeight: 70 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-success"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => handleAction("approved")}
                    disabled={actionLoading}
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => handleAction("rejected")}
                    disabled={actionLoading}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
