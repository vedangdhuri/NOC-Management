import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "NOC Management System",
  description:
    "College-wide NOC management platform for students, faculty, HOD, and admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
