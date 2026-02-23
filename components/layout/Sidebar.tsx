"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  List,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  LogOut,
  School,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const studentNav = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/noc/create", label: "Apply for NOC", icon: PlusCircle },
  { href: "/noc/list", label: "My NOC Requests", icon: List },
];

const facultyNav = [
  { href: "/dashboard/faculty", label: "Dashboard", icon: LayoutDashboard },
  { href: "/noc/list", label: "All NOC Requests", icon: FileText },
];

const hodNav = [
  { href: "/dashboard/hod", label: "Dashboard", icon: LayoutDashboard },
  { href: "/noc/list", label: "NOC Requests", icon: FileText },
  { href: "/admin/classes", label: "Manage Classes", icon: GraduationCap },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/noc/list", label: "All NOC Requests", icon: FileText },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/classes", label: "Manage Classes", icon: GraduationCap },
  { href: "/admin/subjects", label: "Manage Subjects", icon: BookOpen },
];

const navByRole: Record<string, typeof studentNav> = {
  student: studentNav,
  faculty: facultyNav,
  hod: hodNav,
  admin: adminNav,
};

const roleColors: Record<string, string> = {
  student: "badge-student",
  faculty: "badge-faculty",
  hod: "badge-hod",
  admin: "badge-admin",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!user) return null;

  const navItems = navByRole[user.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">N</div>
        <div className="sidebar-logo-text">
          <h2>NOC Manager</h2>
          <p>College Platform</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${pathname === href ? "active" : ""}`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name[0].toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#475569",
              padding: 4,
            }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
