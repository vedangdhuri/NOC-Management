"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { DEPARTMENTS } from "@/lib/utils";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    department: "",
    year: "",
    semester: "",
    division: "",
  });

  const fetch = async () => {
    try {
      const { data } = await api.get("/classes");
      setClasses(data.data);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", department: "", year: "", semester: "", division: "" });
    setShowModal(true);
  };
  const openEdit = (c: any) => {
    setEditItem(c);
    setForm({
      name: c.name,
      department: c.department,
      year: c.year,
      semester: c.semester,
      division: c.division || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        semester: Number(form.semester),
      };
      if (editItem) {
        await api.put(`/classes/${editItem._id}`, payload);
        toast.success("Updated!");
      } else {
        await api.post("/classes", payload);
        toast.success("Created!");
      }
      setShowModal(false);
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Deleted");
      fetch();
    } catch {
      toast.error("Failed");
    }
  };

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
            <h1 className="page-title">Manage Classes</h1>
            <p className="page-subtitle">{classes.length} classes</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <PlusCircle size={18} /> Add Class
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: 200 }}>
            <div className="spinner" />
          </div>
        ) : classes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏫</div>
            <div className="empty-state-text">No classes yet</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {classes.map((c) => (
              <div
                key={c._id}
                className="card"
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#0f172a",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}
                    >
                      {c.department}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(c._id, c.name)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <span
                    className="badge"
                    style={{
                      background: "#dbeafe",
                      color: "#2563eb",
                      borderColor: "#bfdbfe",
                    }}
                  >
                    Year {c.year}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: "#ede9fe",
                      color: "#7c3aed",
                      borderColor: "#ddd6fe",
                    }}
                  >
                    Sem {c.semester}
                  </span>
                  {c.division && (
                    <span
                      className="badge"
                      style={{
                        background: "#f1f5f9",
                        color: "#475569",
                        borderColor: "#e2e8f0",
                      }}
                    >
                      Div {c.division}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 className="modal-title" style={{ margin: 0 }}>
                {editItem ? "Edit Class" : "Add Class"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Class Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. SYCO A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select
                    className="form-select"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    required
                  >
                    <option value="">Year</option>
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>
                        Year {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select
                    className="form-select"
                    value={form.semester}
                    onChange={(e) =>
                      setForm({ ...form, semester: e.target.value })
                    }
                    required
                  >
                    <option value="">Sem</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Division (optional)</label>
                <input
                  className="form-input"
                  placeholder="e.g. A, B, C"
                  value={form.division}
                  onChange={(e) =>
                    setForm({ ...form, division: e.target.value })
                  }
                />
              </div>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
