package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.entity.Ticket;
import com.groupxx.smartcampus.enums.TicketStatus;
import com.groupxx.smartcampus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // Create Ticket
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Get All Tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get Ticket by ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // Update Status
    public Ticket updateStatus(String id, TicketStatus status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Assign Technician
    public Ticket assignTechnician(String id, String technicianId) {
        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Delete Ticket
    public void deleteTicket(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticketRepository.deleteById(id);
    }
}