package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.entity.Comment;
import com.groupxx.smartcampus.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets/{ticketId}/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 1. Add Comment
    @PostMapping
    public Comment addComment(
            @PathVariable String ticketId,
            @RequestBody Comment comment) {

        comment.setTicketId(ticketId);
        return commentService.addComment(comment);
    }

    // 2. Get All Comments for a Ticket
    @GetMapping
    public List<Comment> getComments(@PathVariable String ticketId) {
        return commentService.getCommentsByTicket(ticketId);
    }

    // 3. Update Comment (only owner)
    @PutMapping("/{commentId}")
    public Comment updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String userId,
            @RequestParam String message) {

        return commentService.updateComment(commentId, userId, message);
    }

    // 4. Delete Comment (only owner)
    @DeleteMapping("/{commentId}")
    public String deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String userId) {

        commentService.deleteComment(commentId, userId);
        return "Comment deleted successfully";
    }
}