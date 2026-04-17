package com.groupxx.smartcampus.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    /** null = system-wide / admin-only; set = user-specific */
    private String recipientEmail;

    private String type;
    private String message;
    private String referenceId;
    private String resourceName;
    private boolean read;

    @CreatedDate
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String v) { this.recipientEmail = v; }
    public String getType() { return type; }
    public void setType(String v) { this.type = v; }
    public String getMessage() { return message; }
    public void setMessage(String v) { this.message = v; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String v) { this.referenceId = v; }
    public String getResourceName() { return resourceName; }
    public void setResourceName(String v) { this.resourceName = v; }
    public boolean isRead() { return read; }
    public void setRead(boolean v) { this.read = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}
