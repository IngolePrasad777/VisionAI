package com.visioncheck.repository;

import com.visioncheck.model.TestSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TestSessionRepository extends MongoRepository<TestSession, String> {
    List<TestSession> findByUserIdOrderByTakenAtDesc(String userId);
    long countByPrediction(String prediction);
}
