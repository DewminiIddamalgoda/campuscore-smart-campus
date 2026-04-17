package com.groupxx.smartcampus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupxx.smartcampus.entity.Ticket;
import com.groupxx.smartcampus.enums.TicketStatus;
import com.groupxx.smartcampus.service.TicketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TicketController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
        com.groupxx.smartcampus.SmartCampusApplication.class }))
@AutoConfigureMockMvc(addFilters = false)
public class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TicketService ticketService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateTicket() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setId("t1");
        ticket.setTitle("AC not working..");

        when(ticketService.createTicket(any(Ticket.class))).thenReturn(ticket);

        mockMvc.perform(post("/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("AC not working"));
    }

    @Test
    public void testGetAllTickets() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setId("t1");

        when(ticketService.getAllTickets())
                .thenReturn(Collections.singletonList(ticket));

        mockMvc.perform(get("/tickets"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetTicketById() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setId("t1");

        when(ticketService.getTicketById("t1")).thenReturn(ticket);

        mockMvc.perform(get("/tickets/t1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("t1"));
    }

    @Test
    public void testUpdateStatus() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setId("t1");
        ticket.setStatus(TicketStatus.RESOLVED);

        when(ticketService.updateStatus(eq("t1"), eq(TicketStatus.RESOLVED)))
                .thenReturn(ticket);

        mockMvc.perform(put("/tickets/t1/status")
                .param("status", "RESOLVED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"));
    }

    @Test
    public void testDeleteTicket() throws Exception {
        doNothing().when(ticketService).deleteTicket("t1");

        mockMvc.perform(delete("/tickets/t1"))
                .andExpect(status().isOk());
    }
}