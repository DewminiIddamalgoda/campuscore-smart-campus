package com.groupxx.smartcampus.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private String id;
    private String recipientEmail;
    private String type;
    private String message;
    private String referenceId;
    private String resourceName;
    private boolean read;
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
