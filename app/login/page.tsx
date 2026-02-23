"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const ROLE_REDIRECTS: Record<string, string> = {
  student: "/dashboard/student",
  faculty: "/dashboard/faculty",
  hod: "/dashboard/hod",
  admin: "/dashboard/admin",
};

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      // Fresh fetch to get role
      const { data } = await import("@/lib/api").then((m) =>
        m.default.get("/auth/me"),
      );
      const redirect =
        searchParams.get("redirect") || ROLE_REDIRECTS[data.user.role] || "/";
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(redirect);
    } catch (error: unknown) {
      // Safely access properties on the error object
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div
            className="auth-logo-icon"
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
              N
            </span>
          </div>
          <h1 className="auth-title">NOC Management System</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@college.edu"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: 8, justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? (
              <div
                className="spinner"
                style={{ width: 20, height: 20, borderWidth: 2 }}
              />
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="divider" />

        <p style={{ textAlign: "center", fontSize: 14, color: "#64748b" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#3b82f6",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 20,
            background: "#f8fafc",
            borderRadius: 10,
            padding: 14,
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            DEMO CREDENTIALS
          </p>
          {[
            { role: "Admin", email: "admin@noc.edu", pwd: "admin123" },
            { role: "Faculty", email: "faculty@noc.edu", pwd: "faculty123" },
            { role: "Student", email: "student@noc.edu", pwd: "student123" },
          ].map(({ role, email, pwd }) => (
            <div
              key={role}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#64748b",
                marginBottom: 4,
              }}
            >
              <span style={{ fontWeight: 600, color: "#374151" }}>{role}:</span>
              <span
                style={{ cursor: "pointer", color: "#3b82f6" }}
                onClick={() => setFormData({ email, password: pwd })}
              >
                {email}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
