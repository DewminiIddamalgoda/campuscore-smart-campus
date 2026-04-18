import React, { useEffect, useState } from "react";
import { Container, Card, Badge } from "react-bootstrap";
import { getMyTickets, getComments, addComment } from "../../api/ticketService";
import { useAuth } from "../../context/AuthContext";
import "./ProfileStyles.css";

const UserTicketsPage = () => {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getMyTickets();
      setTickets(res.data || []);

      // 🔥 auto-load comments for each ticket
      res.data.forEach((t) => loadComments(t.id));

    } catch (e) {
      console.error("Failed to load tickets", e);
    }
    setLoading(false);
  };

  const loadComments = async (ticketId) => {
    try {
      const res = await getComments(ticketId);
      setComments((prev) => ({
        ...prev,
        [ticketId]: res.data
      }));
    } catch {}
  };

  const handleAddComment = async (ticketId) => {
    const text = newComment[ticketId];
    if (!text || text.trim() === "") return;

    try {
      await addComment(ticketId, { message: text });

      setNewComment((prev) => ({
        ...prev,
        [ticketId]: ""
      }));

      loadComments(ticketId);

    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "HIGH") return "danger";
    if (priority === "MEDIUM") return "warning";
    return "success";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="profile-page">
      <Container>

        <h2 className="mb-4">🎫 My Tickets</h2>

        {loading ? (
          <p>Loading...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((t) => (
            <Card key={t.id} className="ticket-card mb-4 shadow-sm">
              <Card.Body>

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h5 className="mb-1">{t.title}</h5>

                    {/* 🔹 ticket id */}
                    <small className="text-muted">Ticket ID: #{t.id}</small>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <Badge bg="secondary">{t.status}</Badge>
                    <Badge bg={getPriorityColor(t.priority)}>
                    {t.priority}
                    </Badge>
                </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-muted mb-2">{t.description}</p>

                {/* 🔥 EXTRA INFO ROW */}
                <div className="ticket-meta">
                <span>📁 {t.category || "General"}</span>

                {t.resourceId && (
                    <span>🏢 {t.resourceId}</span>
                )}

                {t.assignedTo && (
                    <span>👨‍🔧 {t.assignedTo}</span>
                )}

                {t.createdAt && (
                    <span>🕒 {formatDate(t.createdAt)}</span>
                )}
                </div>

                {/* 🔥 CHAT COMMENTS */}
                <div className="chat-box">
                  {(comments[t.id] || []).length === 0 ? (
                    <p className="chat-empty">No comments yet</p>
                  ) : (
                    (comments[t.id] || []).map((c, i) => {
                      const isMe = c.userId === user?.userId;

                      return (
                        <div
                          key={i}
                          className={`chat-message ${isMe ? "me" : "other"}`}
                        >
                          <div className="chat-bubble">
                            <span className="chat-user">
                              {isMe ? "You" : c.userId}
                            </span>
                            <p>{c.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* INPUT */}
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Write a message..."
                    value={newComment[t.id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [t.id]: e.target.value
                      }))
                    }
                  />

                  <button
                    className="chat-send-btn"
                    onClick={() => handleAddComment(t.id)}
                  >
                    Send
                  </button>
                </div>

              </Card.Body>
            </Card>
          ))
        )}

      </Container>
    </div>
  );
};

export default UserTicketsPage;