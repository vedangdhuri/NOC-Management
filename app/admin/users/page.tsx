"use client";

import { useEffect, useState, Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { formatDate, DEPARTMENTS } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  semester?: number | string;
  rollNumber?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState("");
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    semester: "",
    rollNumber: "",
  });

  useEffect(() => {
    const role = searchParams.get("role") || "";
    setRoleFilter(role);
    fetchUsers(role);
  }, [searchParams]);

  useEffect(() => {
    setFiltered(
      roleFilter ? users.filter((u) => u.role === roleFilter) : users,
    );
  }, [roleFilter, users]);

  const fetchUsers = async (role = "") => {
    try {
      const q = role ? `?role=${role}` : "";
      const { data } = await api.get(`/users${q}`);
      setUsers(data.data);
      setFiltered(data.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "student",
      department: "",
      semester: "",
      rollNumber: "",
    });
    setShowModal(true);
  };
  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      department: u.department,
      semester: u.semester?.toString() || "",
      rollNumber: u.rollNumber || "",
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
      if (editUser) {
        delete (payload as { password?: string }).password;
        await api.put(`/users/${editUser._id}`, payload);
        toast.success("User updated!");
      } else {
        await api.post("/users", payload);
        toast.success("User created!");
      }
      setShowModal(false);
      fetchUsers(roleFilter);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers(roleFilter);
    } catch {
      toast.error("Delete failed");
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
            <h1 className="page-title">Manage Users</h1>
            <p className="page-subtitle">{filtered.length} users</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <PlusCircle size={18} /> Add User
          </button>
        </div>

        <div className="filters-bar">
          {["", "student", "faculty", "hod", "admin"].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${roleFilter === r ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === "" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: 200 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      {u.rollNumber && (
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          {u.rollNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td style={{ fontSize: 13 }}>{u.department}</td>
                    <td>{u.semester ? `Sem ${u.semester}` : "—"}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(u)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id, u.name)}
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
                {editUser ? "Edit User" : "Create New User"}
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
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {!editUser && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="hod">HOD</option>
                    <option value="admin">Admin</option>
                  </select>
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
              </div>
              {form.role === "student" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <input
                      className="form-input"
                      value={form.rollNumber}
                      onChange={(e) =>
                        setForm({ ...form, rollNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
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
              )}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editUser ? "Update" : "Create"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
