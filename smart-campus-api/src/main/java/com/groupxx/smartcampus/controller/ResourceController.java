package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.dto.ResourceFilterDto;
import com.groupxx.smartcampus.dto.ResourceRequestDto;
import com.groupxx.smartcampus.dto.ResourceResponseDto;
import com.groupxx.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto resourceDto) {
        ResourceResponseDto createdResource = resourceService.createResource(resourceDto);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
        List<ResourceResponseDto> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable String id) {
        ResourceResponseDto resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> updateResource(@PathVariable String id, 
                                                             @Valid @RequestBody ResourceRequestDto resourceDto) {
        ResourceResponseDto updatedResource = resourceService.updateResource(id, resourceDto);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDto>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String status) {
        
        ResourceFilterDto filterDto = new ResourceFilterDto();
        
        if (type != null) {
            try {
                filterDto.setType(com.groupxx.smartcampus.enums.ResourceType.valueOf(type.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid type, will be ignored
            }
        }
        
        filterDto.setLocation(location);
        filterDto.setMinCapacity(minCapacity);
        
        if (status != null) {
            try {
                filterDto.setStatus(com.groupxx.smartcampus.enums.ResourceStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid status, will be ignored
            }
        }
        
        List<ResourceResponseDto> resources = resourceService.searchResources(filterDto);
        return ResponseEntity.ok(resources);
    }
}
