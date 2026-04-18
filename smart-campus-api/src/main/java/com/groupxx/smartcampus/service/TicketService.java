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
    private AuthService authService; // 🔥 important

    // 🔥 Create Ticket (FIXED)
    public Ticket createTicket(String token, Ticket ticket) {

        UserProfileDto user = authService.getCurrentUser(token); // ✅ FIX

        ticket.setUserId(user.getUserId()); // ✅ use DTO
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    // 🔥 Get Logged User Tickets (FIXED)
    public List<Ticket> getMyTickets(String token) {

        UserProfileDto user = authService.getCurrentUser(token); // ✅ FIX

        return ticketRepository.findByUserId(user.getUserId());
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

    // Assign Technician
    public Ticket assignTechnician(String id, String technicianId) {

        AppUser tech = userRepository.findByUserId(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(tech.getUserId());
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
        if (imageUrls == null)
            imageUrls = new ArrayList<>();

        if (imageUrls.size() + files.size() > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        for (MultipartFile file : files) {
            try {
                if (file.isEmpty())
                    continue;

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
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