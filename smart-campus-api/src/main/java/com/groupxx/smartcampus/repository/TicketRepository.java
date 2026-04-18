package com.groupxx.smartcampus.repository;

import com.groupxx.smartcampus.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    // 🔥 required for "my tickets"
    List<Ticket> findByUserId(String userId);
}