package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.dto.auth.UserProfileDto;
import com.groupxx.smartcampus.entity.AppUser;
import com.groupxx.smartcampus.entity.Ticket;
import com.groupxx.smartcampus.enums.TicketStatus;
import com.groupxx.smartcampus.repository.AppUserRepository;
import com.groupxx.smartcampus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthService authService;

    // ================= CREATE TICKET =================
    public Ticket createTicket(String token, Ticket ticket) {

        // VALIDATIONS
        if (ticket.getTitle() == null || ticket.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (ticket.getDescription() == null || ticket.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }
        if (ticket.getPriority() == null) {
            throw new RuntimeException("Priority is required");
        }

        UserProfileDto user = authService.getCurrentUser(token);

        ticket.setUserId(user.getUserId());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // ================= GET MY TICKETS =================
    public List<Ticket> getMyTickets(String token) {
        UserProfileDto user = authService.getCurrentUser(token);
        return ticketRepository.findByUserId(user.getUserId());
    }

    // ================= GET ALL =================
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // ================= GET BY ID =================
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // ================= UPDATE STATUS (WITH WORKFLOW) =================
    public Ticket updateStatus(String id, TicketStatus status) {

        Ticket ticket = getTicketById(id);
        TicketStatus current = ticket.getStatus();

        boolean valid = false;

        if (current == TicketStatus.OPEN && status == TicketStatus.IN_PROGRESS) {
            valid = true;
        } else if (current == TicketStatus.IN_PROGRESS && status == TicketStatus.RESOLVED) {
            valid = true;
        } else if (current == TicketStatus.RESOLVED && status == TicketStatus.CLOSED) {
            valid = true;
        } else if (status == TicketStatus.REJECTED) {
            valid = true;
        }

        if (!valid) {
            throw new RuntimeException("Invalid status transition from " + current + " to " + status);
        }

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);

        // Notifications (keep your existing logic)
        String ownerEmail = userRepository.findByUserId(ticket.getUserId())
                .map(AppUser::getEmail).orElse(null);

        String msg = "Your ticket '" + ticket.getTitle() +
                "' status updated to " + status.name();

        if (ownerEmail != null) {
            notificationService.createUserNotification(
                    ownerEmail, "TICKET_STATUS", msg, ticket.getId(), null);
        }

        notificationService.createSystemNotification(
                "TICKET_STATUS", msg, ticket.getId(), null);

        return saved;
    }

    // ================= ASSIGN TECHNICIAN =================
    public Ticket assignTechnician(String id, String technicianId) {

        AppUser tech = userRepository.findByUserId(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        Ticket ticket = getTicketById(id);

        ticket.setAssignedTo(tech.getUserId());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // ================= DELETE =================
    public void deleteTicket(String id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }

    // ================= IMAGE UPLOAD (SECURED) =================
    public Ticket uploadImages(String id, List<MultipartFile> files) {

        Ticket ticket = getTicketById(id);

        List<String> imageUrls = ticket.getImageUrls();
        if (imageUrls == null) {
            imageUrls = new ArrayList<>();
        }

        // max 3 images
        if (imageUrls.size() + files.size() > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        for (MultipartFile file : files) {

            if (file.isEmpty())
                continue;

            // FILE TYPE CHECK
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            // FILE SIZE CHECK (2MB)
            if (file.getSize() > 2 * 1024 * 1024) {
                throw new RuntimeException("File size must be less than 2MB");
            }

            try {
                String fileName = System.currentTimeMillis() + "_" +
                        file.getOriginalFilename().replace(" ", "_");

                File dest = new File(uploadDir + fileName);
                file.transferTo(dest);

                imageUrls.add("uploads/" + fileName);

            } catch (IOException e) {
                throw new RuntimeException("File upload failed");
            }
        }

        ticket.setImageUrls(imageUrls);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }
}