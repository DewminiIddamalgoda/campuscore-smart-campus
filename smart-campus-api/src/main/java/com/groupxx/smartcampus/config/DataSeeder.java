package com.groupxx.smartcampus.config;

import com.groupxx.smartcampus.entity.Resource;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;
import com.groupxx.smartcampus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(ResourceRepository resourceRepository) {
        return args -> {
            // Check if data already exists
            if (resourceRepository.count() > 0) {
                return;
            }

            List<Resource> resources = new ArrayList<>();

            // Lecture Halls
            resources.add(createResource("Main Lecture Hall A", ResourceType.LECTURE_HALL, 200, 
                "Building A, Floor 1", ResourceStatus.ACTIVE, "08:00", "22:00", 
                "Large lecture hall with modern audio-visual equipment and seating for 200 students"));
            resources.add(createResource("Main Lecture Hall B", ResourceType.LECTURE_HALL, 150, 
                "Building A, Floor 2", ResourceStatus.ACTIVE, "08:00", "22:00", 
                "Medium-sized lecture hall with projector and sound system for 150 students"));
            resources.add(createResource("Engineering Lecture Hall", ResourceType.LECTURE_HALL, 120, 
                "Building B, Floor 1", ResourceStatus.ACTIVE, "08:00", "20:00", 
                "Engineering department lecture hall with specialized equipment"));
            resources.add(createResource("Science Lecture Hall", ResourceType.LECTURE_HALL, 180, 
                "Building C, Floor 1", ResourceStatus.OUT_OF_SERVICE, "08:00", "22:00", 
                "Science lecture hall currently under renovation"));
            resources.add(createResource("Business Lecture Hall", ResourceType.LECTURE_HALL, 100, 
                "Building D, Floor 2", ResourceStatus.ACTIVE, "09:00", "18:00", 
                "Business school lecture hall with video conferencing capabilities"));

            // Laboratories
            resources.add(createResource("Computer Lab 101", ResourceType.LAB, 40, 
                "Building B, Floor 2", ResourceStatus.ACTIVE, "09:00", "18:00", 
                "Computer lab with 40 workstations and high-speed internet"));
            resources.add(createResource("Computer Lab 102", ResourceType.LAB, 40, 
                "Building B, Floor 2", ResourceStatus.ACTIVE, "09:00", "18:00", 
                "Computer lab with 40 workstations and specialized software"));
            resources.add(createResource("Physics Lab", ResourceType.LAB, 30, 
                "Building C, Floor 2", ResourceStatus.ACTIVE, "08:00", "17:00", 
                "Physics laboratory with experimental equipment"));
            resources.add(createResource("Chemistry Lab", ResourceType.LAB, 25, 
                "Building C, Floor 3", ResourceStatus.ACTIVE, "08:00", "17:00", 
                "Chemistry laboratory with safety equipment and fume hoods"));
            resources.add(createResource("Biology Lab", ResourceType.LAB, 35, 
                "Building C, Floor 1", ResourceStatus.OUT_OF_SERVICE, "08:00", "17:00", 
                "Biology laboratory with microscopes and specimens"));

            // Meeting Rooms
            resources.add(createResource("Meeting Room A", ResourceType.MEETING_ROOM, 12, 
                "Building A, Floor 3", ResourceStatus.ACTIVE, "08:00", "18:00", 
                "Small meeting room for team discussions with whiteboard"));
            resources.add(createResource("Meeting Room B", ResourceType.MEETING_ROOM, 8, 
                "Building A, Floor 3", ResourceStatus.ACTIVE, "08:00", "18:00", 
                "Small meeting room for intimate discussions"));
            resources.add(createResource("Conference Room", ResourceType.MEETING_ROOM, 20, 
                "Building D, Floor 1", ResourceStatus.ACTIVE, "08:00", "18:00", 
                "Large conference room with presentation equipment"));
            resources.add(createResource("Executive Meeting Room", ResourceType.MEETING_ROOM, 15, 
                "Building D, Floor 3", ResourceStatus.ACTIVE, "09:00", "17:00", 
                "Executive meeting room with premium facilities"));
            resources.add(createResource("Study Room 1", ResourceType.MEETING_ROOM, 6, 
                "Library, Floor 2", ResourceStatus.ACTIVE, "09:00", "21:00", 
                "Quiet study room for group work"));

            // Equipment
            resources.add(createResource("Portable Projector 1", ResourceType.EQUIPMENT, 1, 
                "IT Department", ResourceStatus.ACTIVE, "08:00", "22:00", 
                "High-quality portable projector with HDMI connectivity"));
            resources.add(createResource("Portable Projector 2", ResourceType.EQUIPMENT, 1, 
                "IT Department", ResourceStatus.ACTIVE, "08:00", "22:00", 
                "High-quality portable projector with wireless connectivity"));
            resources.add(createResource("Video Camera Kit", ResourceType.EQUIPMENT, 1, 
                "Media Center", ResourceStatus.ACTIVE, "09:00", "17:00", 
                "Professional video camera kit for recording lectures"));
            resources.add(createResource("Sound System", ResourceType.EQUIPMENT, 1, 
                "Media Center", ResourceStatus.OUT_OF_SERVICE, "08:00", "22:00", 
                "Portable sound system for events and presentations"));
            resources.add(createResource("Laptop Cart", ResourceType.EQUIPMENT, 20, 
                "IT Department", ResourceStatus.ACTIVE, "08:00", "18:00", 
                "Mobile cart with 20 laptops for classroom use"));

            resourceRepository.saveAll(resources);
            System.out.println("Sample data seeded: " + resources.size() + " resources added");
        };
    }

    private Resource createResource(String name, ResourceType type, Integer capacity, 
                               String location, ResourceStatus status, String availableFrom, 
                               String availableTo, String description) {
        Resource resource = new Resource();
        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setStatus(status);
        resource.setAvailableFrom(availableFrom);
        resource.setAvailableTo(availableTo);
        resource.setDescription(description);
        return resource;
    }
}
