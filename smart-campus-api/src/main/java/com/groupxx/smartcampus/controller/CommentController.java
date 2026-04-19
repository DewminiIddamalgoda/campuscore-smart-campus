package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.entity.Comment;
import com.groupxx.smartcampus.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets/{ticketId}/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Add Comment (201 CREATED)
    @PostMapping
    public ResponseEntity<Comment> addComment(
            @RequestHeader("Authorization") String token,
            @PathVariable String ticketId,
            @RequestBody Comment comment) {

        Comment saved = commentService.addComment(token, ticketId, comment);
        return ResponseEntity.status(201).body(saved);
    }

    // Get Comments (200 OK)
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    // Update Comment
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @RequestHeader("Authorization") String token,
            @PathVariable String commentId,
            @RequestParam String message) {

        Comment updated = commentService.updateComment(token, commentId, message);
        return ResponseEntity.ok(updated);
    }

    // Delete Comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @RequestHeader("Authorization") String token,
            @PathVariable String commentId) {

        commentService.deleteComment(token, commentId);
        return ResponseEntity.noContent().build();
    }
}