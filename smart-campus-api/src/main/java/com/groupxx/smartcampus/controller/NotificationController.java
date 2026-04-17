package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.dto.NotificationDto;
import com.groupxx.smartcampus.entity.AuthSession;
import com.groupxx.smartcampus.repository.AuthSessionRepository;
import com.groupxx.smartcampus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthSessionRepository authSessionRepository;

    /** Resolve email from Bearer token. */
    private String resolveEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        return authSessionRepository.findByToken(token)
                .filter(s -> !s.isRevoked())
                .map(AuthSession::getEmail)
                .orElse(null);
    }

    /** GET /notifications/me — user's notifications */
    @GetMapping("/me")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(
            @RequestHeader("Authorization") String authHeader) {
        String email = resolveEmail(authHeader);
        if (email == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(email));
    }

    /** GET /notifications/me/unread-count */
    @GetMapping("/me/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {
        String email = resolveEmail(authHeader);
        if (email == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notificationService.getUnreadCount(email));
    }

    /** PATCH /notifications/me/mark-all-read */
    @PatchMapping("/me/mark-all-read")
    public ResponseEntity<Void> markAllRead(
            @RequestHeader("Authorization") String authHeader) {
        String email = resolveEmail(authHeader);
        if (email == null) return ResponseEntity.status(401).build();
        notificationService.markAllReadForUser(email);
        return ResponseEntity.ok().build();
    }

    /** GET /notifications — all (admin) */
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAll() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    /** DELETE /notifications/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}
