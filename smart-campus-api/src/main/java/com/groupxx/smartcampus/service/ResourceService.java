package com.groupxx.smartcampus.service;

import com.groupxx.smartcampus.dto.ResourceFilterDto;
import com.groupxx.smartcampus.dto.ResourceRequestDto;
import com.groupxx.smartcampus.dto.ResourceResponseDto;
import com.groupxx.smartcampus.enums.ResourceType;

import java.util.List;

public interface ResourceService {

    ResourceResponseDto createResource(ResourceRequestDto resourceDto);

    List<ResourceResponseDto> getAllResources();

    ResourceResponseDto getResourceById(Long id);

    ResourceResponseDto updateResource(Long id, ResourceRequestDto resourceDto);

    void deleteResource(Long id);

    List<ResourceResponseDto> searchResources(ResourceFilterDto filterDto);

    String calculateSuitabilityBadge(ResourceType type, Integer capacity, String status, 
                                   String availableFrom, String availableTo);
}
