import React, { useEffect, useState } from "react";
import {
  getMyTickets,
  createTicket,
  uploadImages
} from "../../api/ticketService";
import axios from "axios";
import "./TicketsPage.css";

const STATS = [
  { label: "Open Tickets", value: "24", icon: "🟡" },
  { label: "Resolved Today", value: "11", icon: "🟢" },
  { label: "Avg. Response", value: "2.4h", icon: "⏱️" },
  { label: "Critical Issues", value: "3", icon: "🔴" },
];

const FAQ = [
  {
    q: "How long does it take to resolve a ticket?",
    a: "Most tickets are resolved within 24–48 hours. Critical issues are escalated immediately.",
  },
  {
    q: "Can I attach multiple images?",
    a: "Yes! You can attach up to 3 images per ticket to help us understand the issue.",
  },
  {
    q: "How do I track my ticket status?",
    a: "Once submitted, your ticket appears in the Recent Tickets panel with live status updates.",
  },
];

const priorityMeta = {
  LOW: { color: "var(--badge-low)", label: "Low", dot: "🟢" },
  MEDIUM: { color: "var(--badge-medium)", label: "Medium", dot: "🟡" },
  HIGH: { color: "var(--badge-high)", label: "High", dot: "🔴" },
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [filterPriority, setFilterPriority] = useState("ALL");

  const [form, setForm] = useState({
    title: "",
    description: "",
    resourceId: "",
    priority: "MEDIUM",
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    loadTickets();
    loadResources();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getMyTickets();
      setTickets(res.data);
    } catch {
      // fallback demo data
      setTickets([
        { id: 1, title: "Projector not working in Lab 3", description: "The ceiling projector in Lab 3 shows a blue screen and won't connect to any laptop.", priority: "HIGH", status: "OPEN", imageUrls: [] },
        { id: 2, title: "AC unit making loud noise", description: "The air conditioning in Room 204 has been making a grinding noise since Monday.", priority: "MEDIUM", status: "IN PROGRESS", imageUrls: [] },
        { id: 3, title: "Broken chair in Library", description: "One of the study chairs near aisle 5 has a cracked leg and is a safety hazard.", priority: "LOW", status: "RESOLVED", imageUrls: [] },
      ]);
    }
  };

  const loadResources = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/resources");
      setResources(res.data);
    } catch {
      setResources([
        { id: "r1", name: "Computer Lab A" },
        { id: "r2", name: "Library Hall" },
        { id: "r3", name: "Auditorium" },
        { id: "r4", name: "Cafeteria" },
        { id: "r5", name: "Sports Complex" },
      ]);
    }
  };

  const handleFileChange = (e) => {
    const selected = [...e.target.files].slice(0, 3);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (i) => {
    const newFiles = files.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      alert("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createTicket(form);
      const ticketId = res.data.id;
      if (files.length > 0) await uploadImages(ticketId, files);
    } catch {
      // demo: just push locally
      setTickets((prev) => [
        {
          id: Date.now(),
          ...form,
          status: "OPEN",
          imageUrls: previews,
        },
        ...prev,
      ]);
    }
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setForm({ title: "", description: "", resourceId: "", priority: "MEDIUM" });
      setFiles([]);
      setPreviews([]);
      loadTickets();
    }, 1800);
  };

  const filtered =
    filterPriority === "ALL"
      ? tickets
      : tickets.filter((t) => t.priority === filterPriority);

  return (
    <div className="tp-root">

      {/* ─── HERO ─── */}
      <section className="tp-hero">
        <div className="tp-hero-glow" />
        <div className="tp-hero-inner">
          <span className="tp-hero-eyebrow">Campus Support System</span>
          <h1 className="tp-hero-title">
            Report. Track.<br />
            <em>Resolve.</em>
          </h1>
          <p className="tp-hero-sub">
            Submit incident reports for campus resources, attach visual evidence,
            and monitor every ticket from creation to closure — all in one place.
          </p>
          <div className="tp-hero-actions">
            <button className="tp-btn-primary" onClick={() => setShowModal(true)}>
              <span className="tp-btn-icon">＋</span> Create Ticket
            </button>
            <a href="#tickets" className="tp-btn-ghost">View All Tickets ↓</a>
          </div>
        </div>
        <div className="tp-hero-art">
          <div className="tp-hero-card-float tp-hc1">
            <span>🔴</span>
            <div>
              <strong>Projector Failure</strong>
              <small>Lab 3 · High Priority</small>
            </div>
          </div>
          <div className="tp-hero-card-float tp-hc2">
            <span>✅</span>
            <div>
              <strong>Ticket #84 Resolved</strong>
              <small>2 hours ago</small>
            </div>
          </div>
          <div className="tp-hero-card-float tp-hc3">
            <span>🟡</span>
            <div>
              <strong>AC Noise — In Progress</strong>
              <small>Room 204</small>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="tp-stats">
        {STATS.map((s) => (
          <div className="tp-stat-card" key={s.label}>
            <span className="tp-stat-icon">{s.icon}</span>
            <span className="tp-stat-value">{s.value}</span>
            <span className="tp-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="tp-how">
        <h2 className="tp-section-title">How It Works</h2>
        <div className="tp-steps">
          {[
            { n: "01", title: "Report the Issue", desc: "Fill in a short form with the title, description, affected resource, and priority level." },
            { n: "02", title: "Attach Evidence", desc: "Upload up to 5 photos directly from your device to help the support team diagnose faster." },
            { n: "03", title: "Track Progress", desc: "Your ticket appears instantly in the live dashboard with real-time status updates." },
            { n: "04", title: "Resolution & Feedback", desc: "Get notified when the issue is resolved and optionally rate the support experience." },
          ].map((step) => (
            <div className="tp-step" key={step.n}>
              <span className="tp-step-num">{step.n}</span>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TICKETS LIST ─── */}
      <section className="tp-tickets-section" id="tickets">
        <div className="tp-tickets-header">
          <h2 className="tp-section-title" style={{ marginBottom: 0 }}>Recent Tickets</h2>
          <div className="tp-filters">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
              <button
                key={p}
                className={`tp-filter-btn ${filterPriority === p ? "active" : ""}`}
                onClick={() => setFilterPriority(p)}
              >
                {p}
              </button>
            ))}
            <button className="tp-btn-primary tp-btn-sm" onClick={() => setShowModal(true)}>
              ＋ New Ticket
            </button>
          </div>
        </div>

        <div className="tp-ticket-grid">
          {filtered.length === 0 && (
            <div className="tp-empty">
              <span>📭</span>
              <p>No tickets found.</p>
            </div>
          )}
          {filtered.map((t) => (
            <div className="tp-ticket-card" key={t.id}>
              <div className="tp-tc-top">
                <span
                  className="tp-priority-badge"
                  style={{ background: priorityMeta[t.priority]?.color }}
                >
                  {priorityMeta[t.priority]?.dot} {t.priority}
                </span>
                <span className={`tp-status-chip tp-status-${(t.status || "OPEN").toLowerCase().replace(" ", "-")}`}>
                  {t.status || "OPEN"}
                </span>
              </div>
              <h4 className="tp-tc-title">{t.title}</h4>
              <p className="tp-tc-desc">{t.description}</p>
              {t.imageUrls && t.imageUrls.length > 0 && (
                <div className="tp-tc-images">
                  {t.imageUrls.map((img, i) => (
                    <img key={i} src={img.startsWith("blob:") ? img : `http://localhost:8080/api/${img}`} alt="" />
                  ))}
                </div>
              )}
              <div className="tp-tc-footer">
                <span>{`Ticket Id: #${t.id}`}</span>
                <span>{t.resourceId ? `Resource: ${t.resourceId}` : "General"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="tp-faq">
        <h2 className="tp-section-title">Frequently Asked Questions</h2>
        <div className="tp-faq-list">
          {FAQ.map((f, i) => (
            <div className={`tp-faq-item ${openFaq === i ? "open" : ""}`} key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="tp-faq-q">
                <span>{f.q}</span>
                <span className="tp-faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
              </div>
              {openFaq === i && <p className="tp-faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── MODAL ─── */}
      {showModal && (
        <div className="tp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="tp-modal">
            {submitted ? (
              <div className="tp-modal-success">
                <div className="tp-success-icon">✓</div>
                <h3>Ticket Submitted!</h3>
                <p>Your report has been logged. The support team will respond shortly.</p>
              </div>
            ) : (
              <>
                <div className="tp-modal-header">
                  <div>
                    <h3>Create Support Ticket</h3>
                    <p>Fill in the details below to report an issue.</p>
                  </div>
                  <button className="tp-modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>

                <div className="tp-modal-body">
                  <div className="tp-field">
                    <label>Issue Title <span>*</span></label>
                    <input
                      placeholder="e.g. Projector not working in Lab 3"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="tp-field">
                    <label>Description <span>*</span></label>
                    <textarea
                      rows={4}
                      placeholder="Describe the issue in detail — when it started, what you observed, etc."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="tp-field-row">
                    <div className="tp-field">
                      <label>Affected Resource</label>
                      <select
                        value={form.resourceId}
                        onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
                      >
                        <option value="">Select Resource</option>
                        {resources.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="tp-field">
                      <label>Priority Level</label>
                      <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      >
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                      </select>
                    </div>
                  </div>

                  <div className="tp-field">
                    <label>Attach Images <small>(up to 3)</small></label>
                    <label className="tp-file-drop">
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
                      <span className="tp-file-icon">📎</span>
                      <span>Click to upload or drag images here</span>
                    </label>
                    {previews.length > 0 && (
                      <div className="tp-preview-row">
                        {previews.map((src, i) => (
                          <div className="tp-preview-thumb" key={i}>
                            <img src={src} alt="" />
                            <button onClick={() => removeFile(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="tp-modal-footer">
                  <button className="tp-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                    className="tp-btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting || !form.title || !form.description}
                  >
                    {submitting ? "Submitting…" : "Submit Ticket →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
