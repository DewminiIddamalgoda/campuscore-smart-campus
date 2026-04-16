package com.groupxx.smartcampus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupxx.smartcampus.dto.ResourceRequestDto;
import com.groupxx.smartcampus.controller.ResourceController;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;
import com.groupxx.smartcampus.service.ResourceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResourceController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration.class,
        org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration.class
})
public class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResourceService resourceService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllResources() throws Exception {
        when(resourceService.getAllResources()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/resources"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void testCreateResource() throws Exception {
        ResourceRequestDto requestDto = new ResourceRequestDto();
        requestDto.setName("Test Lab");
        requestDto.setType(ResourceType.LAB);
        requestDto.setCapacity(30);
        requestDto.setLocation("Test Location");
        requestDto.setStatus(ResourceStatus.ACTIVE);

        when(resourceService.createResource(any(ResourceRequestDto.class)))
                .thenReturn(new com.groupxx.smartcampus.dto.ResourceResponseDto());

        mockMvc.perform(post("/resources")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testSearchResources() throws Exception {
        when(resourceService.searchResources(any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/resources/search?type=LAB"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
