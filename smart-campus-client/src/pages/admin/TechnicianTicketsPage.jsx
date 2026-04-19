import React, { useEffect, useState } from 'react';
import {
  Container, Table, Spinner, Modal, Button, Form
} from 'react-bootstrap';
import {
  getTickets,
  updateStatus,
  getComments,
  addComment
} from '../../api/ticketService';
import { useAuth } from '../../context/AuthContext';
import './AdminTech.css';

const TechnicianTicketsPage = () => {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getTickets();

      const assigned = (res.data || []).filter(
        (t) => t.assignedTo === user?.userId
      );

      setTickets(assigned);
    } catch (e) {
      console.error("Failed to load tickets", e);
    }
    setLoading(false);
  };

  const openModal = async (ticket) => {
    setSelectedTicket(ticket);
    setStatusUpdate(ticket.status);
    setShowModal(true);
    await loadComments(ticket.id);
  };

  const loadComments = async (ticketId) => {
    try {
      const res = await getComments(ticketId);
      setComments(res.data || []);
    } catch (e) {
      console.error("Failed to load comments");
    }
  };

  const handleUpdateStatus = async () => {
    await updateStatus(selectedTicket.id, statusUpdate);
    loadTickets();
    setShowModal(false);
  };

  const handleAddComment = async () => {
    if (!newComment || newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    await addComment(selectedTicket.id, {
      message: newComment
    });

    setNewComment('');
    loadComments(selectedTicket.id);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner />
      </Container>
    );
  }

  return (
    <div className="technician-page">
      <Container>

        {/* HEADER */}
        <div className="tech-header">
          <h2>My Assigned Tickets</h2>
          <p>Manage and resolve your assigned issues</p>
        </div>

        {/* TABLE */}
        {tickets.length === 0 ? (
          <p>No tickets assigned to you.</p>
        ) : (
          <Table className="tech-table" hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>

                  <td>
                    <span className={`status-badge status-${t.status}`}>
                      {t.status}
                    </span>
                  </td>

                  <td>
                    <span className={`priority-${t.priority}`}>
                      {t.priority}
                    </span>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      className="tech-btn"
                      onClick={() => openModal(t)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

      </Container>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTicket && (
            <>
              <h5>{selectedTicket.title}</h5>
              <p>{selectedTicket.description}</p>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option>OPEN</option>
                  <option>IN_PROGRESS</option>
                  <option>RESOLVED</option>
                  <option>CLOSED</option>
                  <option>REJECTED</option>
                </Form.Select>
              </Form.Group>

              <Button className="mt-3 tech-btn" onClick={handleUpdateStatus}>
                Update Status
              </Button>

              <hr />

              {/* COMMENTS */}
              <h5>Comments</h5>

              <div className="comment-box">
                {comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <strong>{c.userId}</strong>
                    <p>{c.message}</p>
                  </div>
                ))}
              </div>

              <Form.Control
                className="mt-2"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <Button className="mt-2 tech-btn" onClick={handleAddComment}>
                Add Comment
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TechnicianTicketsPage;
