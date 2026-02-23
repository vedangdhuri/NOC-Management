"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { PlusCircle, Search, Download, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NOCItem {
  _id: string;
  nocId: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  studentId?: {
    name: string;
    department: string;
  };
}

export default function NOCListPage() {
  const { user } = useAuth();
  const [nocs, setNocs] = useState<NOCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    api
      .get("/noc?limit=100")
      .then(({ data }) => {
        setNocs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = nocs.filter((n) => {
    const matchesSearch =
      !search ||
      n.nocId?.toLowerCase().includes(search.toLowerCase()) ||
      n.description?.toLowerCase().includes(search.toLowerCase()) ||
      n.studentId?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || n.status === statusFilter;
    const matchesType = !typeFilter || n.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const isStudent = user?.role === "student";

  return (
    <DashboardLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 className="page-title">
              {isStudent ? "My NOC Requests" : "All NOC Requests"}
            </h1>
            <p className="page-subtitle">
              {filtered.length} {filtered.length === 1 ? "request" : "requests"}{" "}
              found
            </p>
          </div>
          {isStudent && (
            <Link href="/noc/create" className="btn btn-primary">
              <PlusCircle size={18} /> Apply for NOC
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by ID, name, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="form-select"
            style={{ width: 160 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {[
              "internship",
              "exam",
              "project",
              "submission",
              "event",
              "other",
            ].map((t) => (
              <option key={t} value={t} style={{ textTransform: "capitalize" }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          {(search || statusFilter || typeFilter) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setTypeFilter("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: 200 }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No NOC requests found</div>
            <div className="empty-state-sub">
              {isStudent
                ? "Click 'Apply for NOC' to submit your first request"
                : "No requests match your filters"}
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>NOC ID</th>
                  {!isStudent && <th>Student</th>}
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((noc) => (
                  <tr key={noc._id}>
                    <td>
                      <span className="noc-id">{noc.nocId}</span>
                    </td>
                    {!isStudent && (
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {noc.studentId?.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          {noc.studentId?.department}
                        </div>
                      </td>
                    )}
                    <td
                      style={{ textTransform: "capitalize", fontWeight: 500 }}
                    >
                      {noc.type}
                    </td>
                    <td>
                      <div
                        style={{
                          maxWidth: 220,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        {noc.description}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${noc.status}`}>
                        {noc.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {formatDate(noc.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link
                          href={`/noc/${noc._id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} /> View
                        </Link>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
