"use client";

import { useState } from "react";
import api from "@/lib/api";

import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { DEPARTMENTS } from "@/lib/utils";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "",
    semester: "",
    rollNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = formData;
      const { data } = await api.post("/auth/register", {
        ...rest,
        semester: rest.semester ? Number(rest.semester) : undefined,
      });
      toast.success("Registration successful!");
      window.location.href = `/dashboard/${data?.user?.role || rest.role || "student"}`;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
              N
            </span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the NOC Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-input"
                placeholder="you@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="hod">HOD</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.role === "student" && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  name="rollNumber"
                  className="form-input"
                  placeholder="e.g. 2201234"
                  value={formData.rollNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select
                  name="semester"
                  className="form-select"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: 4, justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? (
              <div
                className="spinner"
                style={{ width: 20, height: 20, borderWidth: 2 }}
              />
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: "center", fontSize: 14, color: "#64748b" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#3b82f6",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
