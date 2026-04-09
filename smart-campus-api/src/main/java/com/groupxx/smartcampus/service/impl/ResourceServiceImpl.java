package com.groupxx.smartcampus.service.impl;

import com.groupxx.smartcampus.dto.ResourceFilterDto;
import com.groupxx.smartcampus.dto.ResourceRequestDto;
import com.groupxx.smartcampus.dto.ResourceResponseDto;
import com.groupxx.smartcampus.entity.Resource;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;
import com.groupxx.smartcampus.exception.ResourceNotFoundException;
import com.groupxx.smartcampus.repository.ResourceRepository;
import com.groupxx.smartcampus.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public ResourceResponseDto createResource(ResourceRequestDto resourceDto) {
        Resource resource = convertToEntity(resourceDto);
        Resource savedResource = resourceRepository.save(resource);
        return convertToResponseDto(savedResource);
    }

    @Override
    public List<ResourceResponseDto> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDto getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return convertToResponseDto(resource);
    }

    @Override
    public ResourceResponseDto updateResource(String id, ResourceRequestDto resourceDto) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        updateEntityFromDto(existingResource, resourceDto);
        Resource updatedResource = resourceRepository.save(existingResource);
        return convertToResponseDto(updatedResource);
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(resource);
    }

    @Override
    public List<ResourceResponseDto> searchResources(ResourceFilterDto filterDto) {
        return resourceRepository.findByFilters(
                filterDto.getType(),
                filterDto.getLocation(),
                filterDto.getMinCapacity(),
                filterDto.getStatus()
        ).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public String calculateSuitabilityBadge(ResourceType type, Integer capacity, String status, 
                                          String availableFrom, String availableTo) {
        if (ResourceStatus.OUT_OF_SERVICE.name().equals(status)) {
            return "Temporarily unavailable";
        }

        if (availableFrom != null && availableTo != null) {
            try {
                int startHour = Integer.parseInt(availableFrom.split(":")[0]);
                int endHour = Integer.parseInt(availableTo.split(":")[0]);
                int availableHours = endHour - startHour;
                
                if (availableHours < 4) {
                    return "Limited availability";
                }
            } catch (Exception e) {
                // If parsing fails, continue with other checks
            }
        }

        if (type == ResourceType.LECTURE_HALL && capacity > 80) {
            return "Best for lectures";
        } else if (type == ResourceType.MEETING_ROOM && capacity <= 15) {
            return "Best for small meetings";
        } else if (type == ResourceType.LAB) {
            return "Best for practical labs";
        } else if (type == ResourceType.MEETING_ROOM && capacity > 15) {
            return "Best for large meetings";
        } else if (type == ResourceType.LECTURE_HALL && capacity <= 80) {
            return "Best for medium lectures";
        } else if (type == ResourceType.EQUIPMENT) {
            return "Equipment rental";
        }

        return "Available";
    }

    private Resource convertToEntity(ResourceRequestDto dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setStatus(dto.getStatus());
        resource.setAvailableFrom(dto.getAvailableFrom());
        resource.setAvailableTo(dto.getAvailableTo());
        resource.setDescription(dto.getDescription());
        return resource;
    }

    private ResourceResponseDto convertToResponseDto(Resource resource) {
        ResourceResponseDto dto = new ResourceResponseDto();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setStatus(resource.getStatus());
        dto.setAvailableFrom(resource.getAvailableFrom());
        dto.setAvailableTo(resource.getAvailableTo());
        dto.setDescription(resource.getDescription());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setUpdatedAt(resource.getUpdatedAt());
        
        String suitabilityBadge = calculateSuitabilityBadge(
                resource.getType(),
                resource.getCapacity(),
                resource.getStatus().name(),
                resource.getAvailableFrom(),
                resource.getAvailableTo()
        );
        dto.setSuitabilityBadge(suitabilityBadge);
        
        return dto;
    }

    private void updateEntityFromDto(Resource resource, ResourceRequestDto dto) {
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setStatus(dto.getStatus());
        resource.setAvailableFrom(dto.getAvailableFrom());
        resource.setAvailableTo(dto.getAvailableTo());
        resource.setDescription(dto.getDescription());
    }
}
