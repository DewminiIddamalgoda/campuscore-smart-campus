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

    // 🔥 Add Comment (with token)
    @PostMapping
    public Comment addComment(
            @RequestHeader("Authorization") String token,
            @PathVariable String ticketId,
            @RequestBody Comment comment) {

        return commentService.addComment(token, ticketId, comment);
    }

    // Get Comments
    @GetMapping
    public List<Comment> getComments(@PathVariable String ticketId) {
        return commentService.getCommentsByTicket(ticketId);
    }

    // 🔥 Update Comment (secure)
    @PutMapping("/{commentId}")
    public Comment updateComment(
            @RequestHeader("Authorization") String token,
            @PathVariable String commentId,
            @RequestParam String message) {

        return commentService.updateComment(token, commentId, message);
    }

    // 🔥 Delete Comment (secure)
    @DeleteMapping("/{commentId}")
    public String deleteComment(
            @RequestHeader("Authorization") String token,
            @PathVariable String commentId) {

        commentService.deleteComment(token, commentId);
        return "Comment deleted successfully";
    }
}