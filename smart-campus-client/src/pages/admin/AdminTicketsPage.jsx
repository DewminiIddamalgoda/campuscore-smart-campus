import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button,
  Modal, Form, Spinner, InputGroup
} from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import {
  getTickets,
  updateStatus,
  getComments,
  addComment,
  assignTechnician
} from '../../api/ticketService';
import './AdminTicketsPage.css';
import userApi from '../../api/userApi';
import {  } from '../../api/ticketService';

const AdminTicketsPage = () => {

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState('');

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTicket, setAssignTicket] = useState(null);
  const [selectedTech, setSelectedTech] = useState("");
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const loadTechs = async () => {
      try {
        const users = await userApi.getAllUsers();
        const techs = users.filter(u => u.role === "TECHNICIAN");
        setTechnicians(techs);
      } catch (e) {
        console.error("Failed to load technicians");
      }
    };
    loadTechs();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getTickets();
      setTickets(res.data || []);
    } catch (e) {
      console.error("Failed to load tickets", e);
    }
    setLoading(false);
  };

  const loadComments = async (ticketId) => {
    const res = await getComments(ticketId);
    setComments(res.data || []);
  };

  const openModal = async (ticket) => {
    setSelectedTicket(ticket);
    setStatusUpdate(ticket.status);
    setShowModal(true);
    await loadComments(ticket.id);
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

  const getStatusClass = (status) => {
    if (status === "OPEN") return "status-open";
    if (status === "IN_PROGRESS") return "status-progress";
    if (status === "RESOLVED") return "status-resolved";
    if (status === "CLOSED") return "status-closed";
    if (status === "REJECTED") return "status-rejected";
  };

  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      (t.id || "").toLowerCase().includes(term) ||
      (t.userId || "").toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner />
      </Container>
    );
  }

  return (
    <div className="admin-tickets-page">
      <Container fluid className="py-4">

        {/* HEADER */}
        <div className="page-header mb-4">
          <h2 className="user-title">Ticket Management</h2>
          <p className="user-subtitle">
            Monitor issues, update status, and respond to users
          </p>
        </div>

        {/* SEARCH */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="filter-card">
              <Card.Body>
                <InputGroup className="search-input-group">
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    placeholder="Search by Ticket ID or User..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* TABLE */}
        <Card>
          <Card.Body>
            <Table hover >
              <thead>
                <tr>
                  <th style={{ color: "#0f172a" , fontWeight: 600 }}>ID</th>
                  <th style={{ color: "#0f172a", fontWeight: 600 }}>Title</th>
                  <th>User</th>
                  <th>Technician</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.userId}</td>
                      <td>{ticket.assignedTo || "Not Assigned"}</td>

                      <td>
                        <span className={`priority-${ticket.priority}`}>
                          {ticket.priority}
                        </span>
                      </td>

                      <td>
                        <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>

                      <td>
                        <Button
                          size="sm"
                          className="ms-2"
                          variant="dark"
                          onClick={() => {
                            setAssignTicket(ticket);
                            setSelectedTech(ticket.assignedTo || "");
                            setShowAssignModal(true);
                          }}
                        >
                          Assign
                        </Button>

                        <Button size="sm" onClick={() => openModal(ticket)}>
                          <FaEye /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

      </Container>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTicket && (
            <>
              <h5>{selectedTicket.title}</h5>
              <p>{selectedTicket.description}</p>

              {/* IMAGES */}
              {selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0 && (
                <div className="ticket-images">
                  {selectedTicket.imageUrls.map((img, i) => (
                    <img
                      key={i}
                      src={
                        img.startsWith("blob:")
                          ? img
                          : `http://localhost:8080/api/${img}`
                      }
                      alt="ticket"
                      className="ticket-img"
                    />
                  ))}
                </div>
              )}

              <p><strong>User:</strong> {selectedTicket.userId}</p>

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

              <Button className="mt-3" onClick={handleUpdateStatus}>
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

              <Button className="mt-2" onClick={handleAddComment}>
                Add Comment
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Technician</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {assignTicket && (
            <>
              <p><strong>Ticket:</strong> {assignTicket.title}</p>

              <Form.Group>
                <Form.Label>Select Technician</Form.Label>
                <Form.Select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                >
                  <option value="">-- Select Technician --</option>
                  {technicians.map((tech) => (
                    <option key={tech.userId} value={tech.userId}>
                      {tech.fullName || tech.userId}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>

          <Button
            onClick={async () => {
              if (!selectedTech) {
                alert("Please select a technician");
                return;
              }

              await assignTechnician(assignTicket.id, selectedTech);

              alert("Technician assigned successfully");

              setShowAssignModal(false);
              loadTickets();
            }}
          >
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTicketsPage;
