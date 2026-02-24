"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Shield, Users } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        overflowX: "hidden",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          padding: "20px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            NOC System
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {loading ? (
            <div
              className="spinner"
              style={{ width: 24, height: 24, borderWidth: 2 }}
            />
          ) : user ? (
            <Link
              href={`/dashboard/${user.role}`}
              className="btn btn-primary"
              style={{ padding: "10px 20px" }}
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-secondary"
                style={{ padding: "10px 20px" }}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ padding: "10px 20px" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header
        style={{
          padding: "120px 5% 80px",
          textAlign: "center",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "400px",
            height: "400px",
            background: "rgba(99, 102, 241, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "50px",
              background: "#dbeafe",
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            ✨ The Smart Way to Manage Clearances
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-1px",
            }}
          >
            Streamline Your College <br />
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NOC Approvals
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#475569",
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            A comprehensive No Objection Certificate management system designed
            for students, faculty, and administrators to track requests securely
            and efficiently.
          </p>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "16px" }}
          >
            <Link
              href={user ? `/dashboard/${user.role}` : "/register"}
              className="btn btn-primary"
              style={{
                padding: "16px 32px",
                fontSize: "16px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {user ? "View Dashboard" : "Create Account"}{" "}
              <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link
                href="/login"
                className="btn btn-secondary"
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  background: "white",
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section
        style={{ padding: "100px 5%", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "16px",
              letterSpacing: "-0.5px",
            }}
          >
            Why Choose Our System?
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.125rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Designed from the ground up to solve administrative bottlenecks and
            provide complete transparency.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: <FileText size={24} color="#3b82f6" />,
              title: "Paperless Workflows",
              desc: "Submit, amend, and track NOC applications completely online without printing a single sheet.",
              bg: "#dbeafe",
            },
            {
              icon: <Users size={24} color="#8b5cf6" />,
              title: "Role-Based Access",
              desc: "Dedicated dashboards designed specifically for Students, Faculty, HODs, and Admin staff.",
              bg: "#ede9fe",
            },
            {
              icon: <CheckCircle size={24} color="#10b981" />,
              title: "Real-Time Tracking",
              desc: "Know exactly whose desk your application is on with live status updates and timeline views.",
              bg: "#d1fae5",
            },
            {
              icon: <Shield size={24} color="#f59e0b" />,
              title: "Secure & Verified",
              desc: "Automated digital PDF generation ensures that final certificates are tamper-proof and authentic.",
              bg: "#fef3c7",
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: feat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  margin: "0 0 12px",
                  color: "#0f172a",
                }}
              >
                {feat.title}
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About System Section */}
      <section
        style={{ background: "#0f172a", color: "white", padding: "100px 5%" }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                marginBottom: "24px",
                letterSpacing: "-0.5px",
              }}
            >
              About The Project
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              Traditionally, acquiring a No Objection Certificate involved
              running between various department offices, trying to track down
              unavailable professors, and dealing with lost paperwork.
            </p>
            <p
              style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7 }}
            >
              This platform revolutionizes that process by digitizing the entire
              flow. We ensure seamless communication between departments,
              providing students with a stress-free experience while giving
              administrators powerful oversight tools.
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Mock Dashboard Representation */}
            <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#eab308",
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              </div>
            </div>
            <div style={{ padding: "24px", background: "#f8fafc" }}>
              <div
                style={{
                  height: "20px",
                  width: "40%",
                  background: "#e2e8f0",
                  borderRadius: "4px",
                  marginBottom: "16px",
                }}
              />
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    height: "80px",
                    flex: 1,
                    background: "#dbeafe",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    height: "80px",
                    flex: 1,
                    background: "#dcfce7",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    height: "80px",
                    flex: 1,
                    background: "#fef3c7",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div
                style={{
                  height: "40px",
                  width: "100%",
                  background: "white",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <div
                style={{
                  height: "40px",
                  width: "100%",
                  background: "white",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <div
                style={{
                  height: "40px",
                  width: "100%",
                  background: "white",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#ffffff",
          padding: "40px 5%",
          textAlign: "center",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            margin: "0 auto 16px",
          }}
        >
          N
        </div>
        <p style={{ color: "#64748b", fontWeight: 500 }}>
          © {new Date().getFullYear()} NOC Management System.
        </p>
      </footer>
    </div>
  );
}
