"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    classId: "",
    facultyId: "",
    semester: "",
  });

  const fetchAll = async () => {
    try {
      const [sRes, cRes, fRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/classes"),
        api.get("/users?role=faculty"),
      ]);
      setSubjects(sRes.data.data);
      setClasses(cRes.data.data);
      setFaculty(fRes.data.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({
      name: "",
      code: "",
      classId: "",
      facultyId: "",
      semester: "",
    });
    setShowModal(true);
  };
  const openEdit = (s: any) => {
    setEditItem(s);
    setForm({
      name: s.name,
      code: s.code,
      classId: s.classId?._id || "",
      facultyId: s.facultyId?._id || "",
      semester: s.semester || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        semester: form.semester ? Number(form.semester) : undefined,
      };
      if (editItem) {
        await api.put(`/subjects/${editItem._id}`, payload);
        toast.success("Updated!");
      } else {
        await api.post("/subjects", payload);
        toast.success("Created!");
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success("Deleted");
      fetchAll();
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
            <h1 className="page-title">Manage Subjects</h1>
            <p className="page-subtitle">{subjects.length} subjects</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <PlusCircle size={18} /> Add Subject
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: 200 }}>
            <div className="spinner" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">No subjects yet</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Faculty</th>
                  <th>Class</th>
                  <th>Sem</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>
                      <code
                        style={{
                          background: "#f1f5f9",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontSize: 12,
                        }}
                      >
                        {s.code}
                      </code>
                    </td>
                    <td style={{ fontSize: 13 }}>{s.facultyId?.name || "—"}</td>
                    <td style={{ fontSize: 13 }}>{s.classId?.name || "—"}</td>
                    <td>{s.semester ? `Sem ${s.semester}` : "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(s)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s._id, s.name)}
                        >
                          <Trash2 size={14} />
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
                {editItem ? "Edit Subject" : "Add Subject"}
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
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Subject Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Operating Systems"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Code</label>
                  <input
                    className="form-input"
                    placeholder="e.g. CS501"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Assign Faculty</label>
                <select
                  className="form-select"
                  value={form.facultyId}
                  onChange={(e) =>
                    setForm({ ...form, facultyId: e.target.value })
                  }
                >
                  <option value="">Select faculty...</option>
                  {faculty.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} — {f.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign Class</label>
                <select
                  className="form-select"
                  value={form.classId}
                  onChange={(e) =>
                    setForm({ ...form, classId: e.target.value })
                  }
                >
                  <option value="">Select class...</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} — Sem {c.semester}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Semester</label>
                  <select
                    className="form-select"
                    value={form.semester}
                    onChange={(e) =>
                      setForm({ ...form, semester: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>
                </div>
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
