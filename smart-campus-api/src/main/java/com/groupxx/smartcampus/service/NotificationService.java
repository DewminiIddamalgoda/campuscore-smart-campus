package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.dto.NotificationDto;
import com.groupxx.smartcampus.entity.Notification;
import com.groupxx.smartcampus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /** Create a user-specific notification (recipientEmail set). */
    public void createUserNotification(String recipientEmail, String type,
                                       String message, String referenceId, String resourceName) {
        Notification n = new Notification();
        n.setRecipientEmail(recipientEmail);
        n.setType(type);
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setResourceName(resourceName);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    /** Create a system-wide notification visible only to admins/technicians (recipientEmail = null). */
    public void createSystemNotification(String type, String message,
                                         String referenceId, String resourceName) {
        Notification n = new Notification();
        n.setRecipientEmail(null);
        n.setType(type);
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setResourceName(resourceName);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    /** Get notifications for a specific user (their email). */
    public List<NotificationDto> getNotificationsForUser(String email) {
        return notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(email)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Get ALL notifications (admin view). */
    public List<NotificationDto> getAllNotifications() {
        return notificationRepository
                .findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Number of unread notifications for a user. */
    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndReadFalse(email);
    }

    /** Mark all of a user's notifications as read. */
    public void markAllReadForUser(String email) {
        List<Notification> list = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }

    /** Delete a single notification by id. */
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    private NotificationDto toDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setRecipientEmail(n.getRecipientEmail());
        dto.setType(n.getType());
        dto.setMessage(n.getMessage());
        dto.setReferenceId(n.getReferenceId());
        dto.setResourceName(n.getResourceName());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
