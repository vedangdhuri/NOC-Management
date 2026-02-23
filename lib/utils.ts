export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateTime(date: string | Date) {
    return new Date(date).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const NOC_TYPES = [
    { value: "internship", label: "Internship" },
    { value: "exam", label: "Exam" },
    { value: "project", label: "Project" },
    { value: "submission", label: "Submission" },
    { value: "event", label: "Event" },
    { value: "other", label: "Other" },
];

export const ROLES = ["student", "faculty", "hod", "admin"];

export const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
};

export const DEPARTMENTS = [
    "Computer Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
];
