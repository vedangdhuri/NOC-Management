"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Send, Calendar } from "lucide-react";
import { NOC_TYPES, DEPARTMENTS } from "@/lib/utils";

interface ClassOption {
  _id: string;
  name: string;
  semester: number;
}

interface SubjectOption {
  _id: string;
  name: string;
}

export default function CreateNOCPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
    fromDate: "",
    toDate: "",
    classId: "",
  });

  useEffect(() => {
    api
      .get("/classes")
      .then(({ data }) => setClasses(data.data))
      .catch(() => {});
    api
      .get("/subjects")
      .then(({ data }) => setSubjects(data.data))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/noc", formData);
      toast.success("NOC request submitted successfully!");
      router.push(`/noc/${data.data._id}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to submit NOC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Apply for NOC</h1>
          <p className="page-subtitle">
            Fill out the form below to submit your No Objection Certificate
            request
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  NOC Type <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type...</option>
                  {NOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Class</label>
                <select
                  name="classId"
                  className="form-select"
                  value={formData.classId}
                  onChange={handleChange}
                >
                  <option value="">Select class...</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} — Sem {c.semester}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject (if applicable)</label>
              <input
                name="subject"
                className="form-input"
                placeholder="e.g. Operating Systems, DBMS..."
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Calendar
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  />
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  className="form-input"
                  value={formData.fromDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Calendar
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  />
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  className="form-input"
                  value={formData.toDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description / Reason <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Briefly describe the purpose/reason for this NOC request..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="spinner"
                    style={{ width: 18, height: 18, borderWidth: 2 }}
                  />
                ) : (
                  <>
                    <Send size={16} /> Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
