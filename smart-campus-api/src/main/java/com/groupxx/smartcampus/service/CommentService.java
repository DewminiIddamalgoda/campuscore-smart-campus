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

    // Add Comment
    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);

        ticketRepository.findById(comment.getTicketId()).ifPresent(ticket -> {
            String ownerEmail = userRepository.findByUserId(ticket.getUserId())
                    .map(AppUser::getEmail).orElse(null);
            if (ownerEmail != null && !ownerEmail.equals(
                    userRepository.findByUserId(comment.getUserId()).map(AppUser::getEmail).orElse(null))) {
                notificationService.createUserNotification(ownerEmail, "TICKET_COMMENT",
                        "A new comment was added on your ticket '" + ticket.getTitle() + "'.",
                        ticket.getId(), null);
            }
            notificationService.createSystemNotification("TICKET_COMMENT",
                    "New comment on ticket '" + ticket.getTitle() + "'.", ticket.getId(), null);
        });

        return saved;
    }

    // Get Comments by Ticket
    public List<Comment> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    // Update Comment (only owner)
    public Comment updateComment(String commentId, String userId, String message) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own comment");
        }

        comment.setMessage(message);
        return commentRepository.save(comment);
    }

    // Delete Comment (only owner)
    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comment");
        }

        commentRepository.deleteById(commentId);
    }
}