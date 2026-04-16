package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.entity.Ticket;
import com.groupxx.smartcampus.enums.TicketStatus;
import com.groupxx.smartcampus.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*") // allow frontend access
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. Create Ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.createTicket(ticket));
    }

    // 2. Get All Tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // 3. Get Ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // 4. Update Ticket Status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestParam TicketStatus status) {

        return ResponseEntity.ok(ticketService.updateStatus(id, status));
    }

    // 5. Assign Technician
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {

        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }

    // 6. Delete Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok("Ticket deleted successfully");
    }
}