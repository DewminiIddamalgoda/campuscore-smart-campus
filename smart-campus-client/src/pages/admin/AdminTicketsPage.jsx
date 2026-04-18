import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, Button,
  Modal, Form, Spinner
} from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import {
  getTickets,
  updateStatus,
  getComments,
  addComment
} from '../../api/ticketService';
import './AdminTicketsPage.css'

const AdminTicketsPage = () => {

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState('');

  // 🔥 Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const res = await getTickets();
    setTickets(res.data);
    setLoading(false);
  };

  // 🔥 Load comments
  const loadComments = async (ticketId) => {
    const res = await getComments(ticketId);
    setComments(res.data);
  };

  const openModal = async (ticket) => {
    setSelectedTicket(ticket);
    setStatusUpdate(ticket.status);
    setShowModal(true);
    await loadComments(ticket.id);
  };

  // Update status
  const handleUpdateStatus = async () => {
    await updateStatus(selectedTicket.id, statusUpdate);
    loadTickets();
    setShowModal(false);
  };

  // 🔥 Add comment
  const handleAddComment = async () => {
    if (!newComment) return;

    await addComment(selectedTicket.id, {
      userId: "admin1",
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
    <div className="admin-tickets-page">
      <Container fluid>

        {/* HEADER */}
        <div className="admin-ticket-header">
            <div>
            <h2 style={{ color: "red !important" }}>
  Ticket Management
</h2>
                <p>Monitor issues, update status, and respond to users</p>
            </div>

            <div className="admin-header-stats">
                <div className="stat-box">
                <span>{tickets.length}</span>
                <small>Total Tickets</small>
                </div>
                <div className="stat-box">
                <span>{tickets.filter(t => t.status === "OPEN").length}</span>
                <small>Open</small>
                </div>
                <div className="stat-box">
                <span>{tickets.filter(t => t.status === "RESOLVED").length}</span>
                <small>Resolved</small>
                </div>
            </div>
            </div>

        {/* TABLE */}
        <Card>
          <Card.Body>

            <Table hover responsive>
              <thead>
                <tr>
                  <th >ID</th>
                  <th >Title</th>
                  <th >User</th>
                  <th >Priority</th>
                  <th >Status</th>
                  <th >Actions</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.userId}</td>

                    <td>
                      <Badge bg={
                        ticket.priority === 'HIGH' ? 'danger' :
                        ticket.priority === 'MEDIUM' ? 'warning' : 'success'
                      }>
                        {ticket.priority}
                      </Badge>
                    </td>

                    <td>
                      <Badge bg="info">{ticket.status}</Badge>
                    </td>

                    <td>
                      <Button size="sm" onClick={() => openModal(ticket)}>
                        <FaEye /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

          </Card.Body>
        </Card>

      </Container>

      {/* 🔥 MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTicket && (
            <>
              {/* DETAILS */}
              <h5>{selectedTicket.title}</h5>
              <p>{selectedTicket.description}</p>

              <p><strong>Ticket ID:</strong> {selectedTicket.id}</p>
              <p><strong>User:</strong> {selectedTicket.userId}</p>

              {/* IMAGES */}
              {selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0 && (
  <div className="tp-tc-images">
    {selectedTicket.imageUrls.map((img, i) => (
      <img
        key={i}
        src={
          img.startsWith("blob:")
            ? img
            : `http://localhost:8080/api/${img}`
        }
        alt="ticket"
      />
    ))}
  </div>
)}

              <hr />

              {/* STATUS UPDATE */}
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option>OPEN</option>
                  <option>IN_PROGRESS</option>
                  <option>RESOLVED</option>
                </Form.Select>
              </Form.Group>

              <div className="mt-3">
                <Button onClick={handleUpdateStatus}>
                  Update Status
                </Button>
              </div>

              <hr />

              {/* 🔥 COMMENTS */}
              <h5>Comments</h5>

              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {comments.map(c => (
                  <div key={c.id} style={{ marginBottom: '10px' }}>
                    <strong>{c.userId}</strong>
                    <p>{c.message}</p>
                  </div>
                ))}
              </div>

              {/* ADD COMMENT */}
              <Form.Control
                className="mt-2"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <Button className="mt-2" onClick={handleAddComment}>
                Add Comment
              </Button>

            </>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default AdminTicketsPage;