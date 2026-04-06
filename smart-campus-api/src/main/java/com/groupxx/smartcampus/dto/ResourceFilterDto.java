package com.groupxx.smartcampus.dto;

import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;

public class ResourceFilterDto {

    private ResourceType type;
    private String location;
    private Integer minCapacity;
    private ResourceStatus status;

    // Getters and Setters
    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getMinCapacity() { return minCapacity; }
    public void setMinCapacity(Integer minCapacity) { this.minCapacity = minCapacity; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }
}
