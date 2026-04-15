package com.groupxx.smartcampus.dto;

import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Max;

public class ResourceRequestDto {

    @NotBlank(message = "Resource name is required")
    @Size(min = 3, max = 100, message = "Resource name must be between 3 and 100 characters")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    @Max(value = 1000, message = "Capacity must not exceed 1000")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    @Size(min = 3, max = 200, message = "Location must be between 3 and 200 characters")
    private String location;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Available From must be in HH:MM format (e.g., 09:00)")
    private String availableFrom;

    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Available To must be in HH:MM format (e.g., 17:00)")
    private String availableTo;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }

    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }

    public String getAvailableTo() { return availableTo; }
    public void setAvailableTo(String availableTo) { this.availableTo = availableTo; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
