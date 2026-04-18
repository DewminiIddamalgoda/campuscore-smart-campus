package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.entity.Ticket;
import com.groupxx.smartcampus.enums.TicketStatus;
import com.groupxx.smartcampus.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 🔥 Create Ticket (logged user)
    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestHeader("Authorization") String token,
            @RequestBody Ticket ticket) {

        return ResponseEntity.ok(ticketService.createTicket(token, ticket));
    }

    // 🔥 Get Logged User Tickets
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(
            @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(ticketService.getMyTickets(token));
    }

    // Get All Tickets (admin use)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // Get Ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // Update Status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestParam TicketStatus status) {

        return ResponseEntity.ok(ticketService.updateStatus(id, status));
    }

    // Assign Technician
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {

        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }

    // Delete Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok("Ticket deleted successfully");
    }

    // Upload Images
    @PostMapping("/{id}/upload")
    public ResponseEntity<Ticket> uploadImages(
            @PathVariable String id,
            @RequestParam("files") List<MultipartFile> files) {

        return ResponseEntity.ok(ticketService.uploadImages(id, files));
    }
}