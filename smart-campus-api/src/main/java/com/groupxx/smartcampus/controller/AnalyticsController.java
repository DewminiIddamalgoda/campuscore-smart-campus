package com.groupxx.smartcampus.controller;

import com.groupxx.smartcampus.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverviewStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<com.groupxx.smartcampus.dto.ResourceResponseDto> allResources = resourceService.getAllResources();
            
            if (allResources == null) {
                stats.put("error", "Unable to fetch resources data");
                return ResponseEntity.status(503).body(stats);
            }
            
            // Total resources
            stats.put("totalResources", allResources.size());
            
            // Active resources
            long activeResources = allResources.stream()
                .filter(r -> r != null && r.getStatus() != null && "ACTIVE".equals(r.getStatus().toString()))
                .count();
            stats.put("activeResources", activeResources);
            
            // Out of service resources
            long outOfServiceResources = allResources.stream()
                .filter(r -> r != null && r.getStatus() != null && "OUT_OF_SERVICE".equals(r.getStatus().toString()))
                .count();
            stats.put("outOfServiceResources", outOfServiceResources);
            
            // Resources by type
            Map<String, Long> resourcesByType = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getType() != null) {
                    String type = resource.getType().toString();
                    resourcesByType.put(type, resourcesByType.getOrDefault(type, 0L) + 1);
                }
            });
            stats.put("resourcesByType", resourcesByType);
            
            // Average capacity
            double avgCapacity = allResources.stream()
                .filter(r -> r != null && r.getCapacity() != null)
                .mapToInt(r -> r.getCapacity())
                .average()
                .orElse(0.0);
            stats.put("averageCapacity", Math.round(avgCapacity));
            
            // Total capacity
            int totalCapacity = allResources.stream()
                .filter(r -> r != null && r.getCapacity() != null)
                .mapToInt(r -> r.getCapacity())
                .sum();
            stats.put("totalCapacity", totalCapacity);
            
            // Resources by location (group by building)
            Map<String, Long> resourcesByLocation = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getLocation() != null) {
                    String location = resource.getLocation();
                    if (location.contains("Building")) {
                        try {
                            String[] parts = location.split("Building")[1].split(",");
                            if (parts.length > 0) {
                                String building = parts[0].trim();
                                resourcesByLocation.put("Building " + building, 
                                    resourcesByLocation.getOrDefault("Building " + building, 0L) + 1);
                            }
                        } catch (Exception e) {
                            // If parsing fails, use full location
                            resourcesByLocation.put(location, resourcesByLocation.getOrDefault(location, 0L) + 1);
                        }
                    } else {
                        resourcesByLocation.put(location, resourcesByLocation.getOrDefault(location, 0L) + 1);
                    }
                }
            });
            stats.put("resourcesByLocation", resourcesByLocation);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            stats.put("error", "Failed to fetch analytics data: " + e.getMessage());
            return ResponseEntity.status(500).body(stats);
        }
    }

    @GetMapping("/charts")
    public ResponseEntity<Map<String, Object>> getChartData() {
        Map<String, Object> chartData = new HashMap<>();
        
        try {
            List<com.groupxx.smartcampus.dto.ResourceResponseDto> allResources = resourceService.getAllResources();
            
            if (allResources == null) {
                chartData.put("error", "Unable to fetch resources data");
                return ResponseEntity.status(503).body(chartData);
            }
            
            // Resource type distribution for pie chart
            Map<String, Long> typeDistribution = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getType() != null) {
                    String type = resource.getType().toString();
                    typeDistribution.put(type, typeDistribution.getOrDefault(type, 0L) + 1);
                }
            });
            
            // Status distribution for pie chart
            Map<String, Long> statusDistribution = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getStatus() != null) {
                    String status = resource.getStatus().toString();
                    statusDistribution.put(status, statusDistribution.getOrDefault(status, 0L) + 1);
                }
            });
            
            // Capacity distribution for bar chart
            Map<String, Long> capacityDistribution = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getCapacity() != null) {
                    Integer capacity = resource.getCapacity();
                    String range;
                    if (capacity <= 10) range = "1-10";
                    else if (capacity <= 25) range = "11-25";
                    else if (capacity <= 50) range = "26-50";
                    else if (capacity <= 100) range = "51-100";
                    else range = "100+";
                    capacityDistribution.put(range, capacityDistribution.getOrDefault(range, 0L) + 1);
                }
            });
            
            chartData.put("typeDistribution", typeDistribution);
            chartData.put("statusDistribution", statusDistribution);
            chartData.put("capacityDistribution", capacityDistribution);
            
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            chartData.put("error", "Failed to fetch chart data: " + e.getMessage());
            return ResponseEntity.status(500).body(chartData);
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<com.groupxx.smartcampus.dto.ResourceResponseDto>> getRecentResources() {
        try {
            List<com.groupxx.smartcampus.dto.ResourceResponseDto> allResources = resourceService.getAllResources();
            
            if (allResources == null) {
                return ResponseEntity.status(503).body(java.util.Collections.emptyList());
            }
            
            // Sort by creation date (newest first) - note: this is a simple implementation
            // In a real scenario, you'd sort by actual createdAt timestamp
            List<com.groupxx.smartcampus.dto.ResourceResponseDto> recentResources = allResources.stream()
                .filter(r -> r != null)
                .skip(Math.max(0, allResources.size() - 5))
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(recentResources);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Collections.emptyList());
        }
    }

    @GetMapping("/pdf-import")
    public ResponseEntity<Map<String, Object>> importPDFAnalytics() {
        try {
            List<com.groupxx.smartcampus.dto.ResourceResponseDto> allResources = resourceService.getAllResources();
            Map<String, Object> pdfData = new HashMap<>();
            
            if (allResources == null) {
                pdfData.put("success", false);
                pdfData.put("message", "Unable to fetch resources data");
                return ResponseEntity.status(503).body(pdfData);
            }
            
            // Specific resource type counts
            long labs = allResources.stream()
                .filter(r -> r != null && r.getType() != null && "LAB".equals(r.getType().toString()))
                .count();
            long meetingRooms = allResources.stream()
                .filter(r -> r != null && r.getType() != null && "MEETING_ROOM".equals(r.getType().toString()))
                .count();
            long equipment = allResources.stream()
                .filter(r -> r != null && r.getType() != null && "EQUIPMENT".equals(r.getType().toString()))
                .count();
            long lectureHalls = allResources.stream()
                .filter(r -> r != null && r.getType() != null && "LECTURE_HALL".equals(r.getType().toString()))
                .count();
            
            // Real-time analytics data
            Map<String, Object> realTimeStats = new HashMap<>();
            realTimeStats.put("labs", labs);
            realTimeStats.put("meetingRooms", meetingRooms);
            realTimeStats.put("equipment", equipment);
            realTimeStats.put("lectureHalls", lectureHalls);
            realTimeStats.put("totalResources", allResources.size());
            realTimeStats.put("activeResources", allResources.stream()
                .filter(r -> r != null && r.getStatus() != null && "ACTIVE".equals(r.getStatus().toString()))
                .count());
            realTimeStats.put("outOfServiceResources", allResources.stream()
                .filter(r -> r != null && r.getStatus() != null && "OUT_OF_SERVICE".equals(r.getStatus().toString()))
                .count());
            
            // Capacity analytics
            double avgCapacity = allResources.stream()
                .filter(r -> r != null && r.getCapacity() != null)
                .mapToInt(r -> r.getCapacity())
                .average()
                .orElse(0.0);
            int totalCapacity = allResources.stream()
                .filter(r -> r != null && r.getCapacity() != null)
                .mapToInt(r -> r.getCapacity())
                .sum();
            
            realTimeStats.put("averageCapacity", Math.round(avgCapacity));
            realTimeStats.put("totalCapacity", totalCapacity);
            
            // Status distribution
            Map<String, Long> statusDistribution = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getStatus() != null) {
                    String status = resource.getStatus().toString();
                    statusDistribution.put(status, statusDistribution.getOrDefault(status, 0L) + 1);
                }
            });
            realTimeStats.put("statusDistribution", statusDistribution);
            
            // Type distribution
            Map<String, Long> typeDistribution = new HashMap<>();
            allResources.forEach(resource -> {
                if (resource != null && resource.getType() != null) {
                    String type = resource.getType().toString();
                    typeDistribution.put(type, typeDistribution.getOrDefault(type, 0L) + 1);
                }
            });
            realTimeStats.put("typeDistribution", typeDistribution);
            
            // Recent resources for PDF
            List<com.groupxx.smartcampus.dto.ResourceResponseDto> recentResources = allResources.stream()
                .filter(r -> r != null)
                .skip(Math.max(0, allResources.size() - 10))
                .collect(java.util.stream.Collectors.toList());
            realTimeStats.put("recentResources", recentResources);
            
            // Timestamp for PDF
            realTimeStats.put("generatedAt", java.time.LocalDateTime.now().toString());
            realTimeStats.put("generatedDate", java.time.LocalDate.now().toString());
            realTimeStats.put("generatedTime", java.time.LocalTime.now().toString());
            
            pdfData.put("analytics", realTimeStats);
            pdfData.put("success", true);
            pdfData.put("message", "PDF analytics data imported successfully");
            
            return ResponseEntity.ok(pdfData);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to import PDF analytics: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
