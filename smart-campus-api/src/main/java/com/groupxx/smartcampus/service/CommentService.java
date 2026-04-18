package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.entity.AppUser;
import com.groupxx.smartcampus.entity.Comment;
import com.groupxx.smartcampus.entity.Ticket;
import com.groupxx.smartcampus.repository.AppUserRepository;
import com.groupxx.smartcampus.repository.CommentRepository;
import com.groupxx.smartcampus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthService authService; // 🔥 NEW

    // 🔥 Add Comment (secure)
    public Comment addComment(String token, String ticketId, Comment comment) {

        var user = authService.getCurrentUser(token);

        comment.setTicketId(ticketId);
        comment.setUserId(user.getUserId()); // ✅ REAL USER
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);

        ticketRepository.findById(ticketId).ifPresent(ticket -> {
            String ownerEmail = userRepository.findByUserId(ticket.getUserId())
                    .map(AppUser::getEmail).orElse(null);

            if (ownerEmail != null) {
                notificationService.createUserNotification(
                        ownerEmail,
                        "TICKET_COMMENT",
                        "New comment on your ticket '" + ticket.getTitle() + "'",
                        ticket.getId(),
                        null);
            }
        });

        return saved;
    }

    // Get Comments
    public List<Comment> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    // 🔥 Update Comment
    public Comment updateComment(String token, String commentId, String message) {

        var user = authService.getCurrentUser(token);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You can only edit your own comment");
        }

        comment.setMessage(message);
        return commentRepository.save(comment);
    }

    // 🔥 Delete Comment
    public void deleteComment(String token, String commentId) {

        var user = authService.getCurrentUser(token);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You can only delete your own comment");
        }

        commentRepository.deleteById(commentId);
    }
}