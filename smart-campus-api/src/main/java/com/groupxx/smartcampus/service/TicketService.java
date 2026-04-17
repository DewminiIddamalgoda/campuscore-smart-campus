package com.groupxx.smartcampus.service;

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
        Ticket saved = ticketRepository.save(ticket);

        String ownerEmail = userRepository.findByUserId(ticket.getUserId())
                .map(AppUser::getEmail).orElse(null);
        String msg = "Your ticket '" + ticket.getTitle() + "' status has been updated to " + status.name() + ".";
        if (ownerEmail != null) {
            notificationService.createUserNotification(ownerEmail, "TICKET_STATUS", msg, ticket.getId(), null);
        }
        notificationService.createSystemNotification("TICKET_STATUS", msg, ticket.getId(), null);

        return saved;
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
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }

    // Image Upload
    public Ticket uploadImages(String id, List<MultipartFile> files) {

        Ticket ticket = getTicketById(id);

        List<String> imageUrls = ticket.getImageUrls();
        if (imageUrls == null) {
            imageUrls = new ArrayList<>();
        }

        if (imageUrls.size() + files.size() > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        for (MultipartFile file : files) {
            try {
                if (file.isEmpty()) {
                    continue;
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                File destination = new File(uploadDir + fileName);

                file.transferTo(destination);

                // Save relative path (clean)
                imageUrls.add("uploads/" + fileName);

            } catch (IOException e) {
                throw new RuntimeException("File upload failed: " + e.getMessage());
            }
        }

        ticket.setImageUrls(imageUrls);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }
}