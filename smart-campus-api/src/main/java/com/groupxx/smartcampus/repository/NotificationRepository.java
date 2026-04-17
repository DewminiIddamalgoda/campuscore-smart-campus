package com.groupxx.smartcampus.repository;

import com.groupxx.smartcampus.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String email);
    List<Notification> findAllByOrderByCreatedAtDesc();
    long countByRecipientEmailAndReadFalse(String email);
    List<Notification> findByRecipientEmailIsNullOrderByCreatedAtDesc();
}
