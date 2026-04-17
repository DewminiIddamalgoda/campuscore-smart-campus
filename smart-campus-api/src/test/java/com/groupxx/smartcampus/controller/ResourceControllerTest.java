package com.groupxx.smartcampus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupxx.smartcampus.dto.ResourceFilterDto;
import com.groupxx.smartcampus.dto.ResourceRequestDto;
import com.groupxx.smartcampus.dto.ResourceResponseDto;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;
import com.groupxx.smartcampus.service.ResourceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResourceController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResourceService resourceService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateResource() throws Exception {
        ResourceRequestDto requestDto = new ResourceRequestDto();
        requestDto.setName("Lecture Hall A");
        requestDto.setType(ResourceType.LECTURE_HALL);
        requestDto.setCapacity(100);
        requestDto.setLocation("Building 1, Floor 2");
        requestDto.setStatus(ResourceStatus.ACTIVE);

        ResourceResponseDto responseDto = new ResourceResponseDto();
        responseDto.setId("r1");
        responseDto.setName("Lecture Hall A");
        responseDto.setType(ResourceType.LECTURE_HALL);
        responseDto.setCapacity(100);
        responseDto.setLocation("Building 1, Floor 2");
        responseDto.setStatus(ResourceStatus.ACTIVE);

        when(resourceService.createResource(any(ResourceRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("r1"))
                .andExpect(jsonPath("$.name").value("Lecture Hall A"))
                .andExpect(jsonPath("$.type").value("LECTURE_HALL"))
                .andExpect(jsonPath("$.capacity").value(100))
                .andExpect(jsonPath("$.location").value("Building 1, Floor 2"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void testGetAllResources() throws Exception {
        ResourceResponseDto responseDto = new ResourceResponseDto();
        responseDto.setId("r1");
        responseDto.setName("Lecture Hall A");
        responseDto.setType(ResourceType.LECTURE_HALL);
        responseDto.setCapacity(100);
        responseDto.setLocation("Building 1, Floor 2");
        responseDto.setStatus(ResourceStatus.ACTIVE);

        when(resourceService.getAllResources())
                .thenReturn(Collections.singletonList(responseDto));

        mockMvc.perform(get("/resources"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("r1"))
                .andExpect(jsonPath("$[0].name").value("Lecture Hall A"));
    }

    @Test
    void testGetResourceById() throws Exception {
        ResourceResponseDto responseDto = new ResourceResponseDto();
        responseDto.setId("r1");
        responseDto.setName("Lecture Hall A");
        responseDto.setType(ResourceType.LECTURE_HALL);
        responseDto.setCapacity(100);
        responseDto.setLocation("Building 1, Floor 2");
        responseDto.setStatus(ResourceStatus.ACTIVE);

        when(resourceService.getResourceById("r1")).thenReturn(responseDto);

        mockMvc.perform(get("/resources/r1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("r1"))
                .andExpect(jsonPath("$.name").value("Lecture Hall A"));
    }

    @Test
    void testUpdateResource() throws Exception {
        ResourceRequestDto requestDto = new ResourceRequestDto();
        requestDto.setName("Updated Lecture Hall");
        requestDto.setType(ResourceType.LECTURE_HALL);
        requestDto.setCapacity(150);
        requestDto.setLocation("Building 1, Floor 2");
        requestDto.setStatus(ResourceStatus.ACTIVE);

        ResourceResponseDto responseDto = new ResourceResponseDto();
        responseDto.setId("r1");
        responseDto.setName("Updated Lecture Hall");
        responseDto.setType(ResourceType.LECTURE_HALL);
        responseDto.setCapacity(150);
        responseDto.setLocation("Building 1, Floor 2");
        responseDto.setStatus(ResourceStatus.ACTIVE);

        when(resourceService.updateResource(eq("r1"), any(ResourceRequestDto.class)))
                .thenReturn(responseDto);

        mockMvc.perform(put("/resources/r1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("r1"))
                .andExpect(jsonPath("$.name").value("Updated Lecture Hall"))
                .andExpect(jsonPath("$.capacity").value(150));
    }

    @Test
    void testDeleteResource() throws Exception {
        doNothing().when(resourceService).deleteResource("r1");

        mockMvc.perform(delete("/resources/r1"))
                .andExpect(status().isOk());
    }

    @Test
    void testSearchResources() throws Exception {
        ResourceFilterDto filterDto = new ResourceFilterDto();
        filterDto.setType(ResourceType.LECTURE_HALL);
        filterDto.setLocation("Building 1");

        ResourceResponseDto responseDto = new ResourceResponseDto();
        responseDto.setId("r1");
        responseDto.setName("Lecture Hall A");
        responseDto.setType(ResourceType.LECTURE_HALL);
        responseDto.setLocation("Building 1");
        responseDto.setStatus(ResourceStatus.ACTIVE);

        when(resourceService.searchResources(any(ResourceFilterDto.class)))
                .thenReturn(Collections.singletonList(responseDto));

        mockMvc.perform(post("/resources/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(filterDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("r1"))
                .andExpect(jsonPath("$[0].name").value("Lecture Hall A"))
                .andExpect(jsonPath("$[0].type").value("LECTURE_HALL"));
    }
}