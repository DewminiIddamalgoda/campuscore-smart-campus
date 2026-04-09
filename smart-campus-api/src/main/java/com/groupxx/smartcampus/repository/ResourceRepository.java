package com.groupxx.smartcampus.repository;

import com.groupxx.smartcampus.entity.Resource;
import com.groupxx.smartcampus.enums.ResourceStatus;
import com.groupxx.smartcampus.enums.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    @Query("{ '$and': [ " +
           " { '$or': [ { 'type': null }, { 'type': ?0 } ] }, " +
           " { '$or': [ { 'location': null }, { 'location': { '$regex': ?1, '$options': 'i' } } ] }, " +
           " { '$or': [ { 'capacity': null }, { 'capacity': { '$gte': ?2 } } ] }, " +
           " { '$or': [ { 'status': null }, { 'status': ?3 } ] } " +
           "] }")
    List<Resource> findByFilters(@Param("type") ResourceType type,
                                @Param("location") String location,
                                @Param("minCapacity") Integer minCapacity,
                                @Param("status") ResourceStatus status);
}
