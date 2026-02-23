"use client";

import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5f9",
      }}
    >
      <div style={{ textAlign: "center", padding: 40 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <ShieldOff size={40} color="#dc2626" />
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          Access Denied
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 24 }}>
          You don&apos;t have permission to access this page.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
