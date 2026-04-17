package com.groupxx.smartcampus.repository;

import com.groupxx.smartcampus.entity.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByEmailIgnoreCase(String email);

    Optional<AppUser> findByUserId(String userId);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByContactNumber(String contactNumber);

    boolean existsByUserId(String userId);
}
