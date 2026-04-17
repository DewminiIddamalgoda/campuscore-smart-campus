package com.groupxx.smartcampus.repository;

import com.groupxx.smartcampus.entity.AuthSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthSessionRepository extends MongoRepository<AuthSession, String> {
    Optional<AuthSession> findByToken(String token);
}
