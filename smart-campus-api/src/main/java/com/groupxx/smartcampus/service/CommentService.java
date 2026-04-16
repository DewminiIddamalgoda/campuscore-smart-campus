package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.entity.Comment;
import com.groupxx.smartcampus.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // Add Comment
    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
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