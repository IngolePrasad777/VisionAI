package com.visioncheck.service;

import com.visioncheck.dto.TestSubmitRequest;
import com.visioncheck.model.TestSession;
import com.visioncheck.repository.TestSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestSessionRepository testSessionRepository;
    private final MlService mlService;

    public TestSession submitTest(String userId, TestSubmitRequest req) {
        // Call ML microservice
        Map<String, Object> result = mlService.predict(req);

        // Build and save session
        TestSession session = new TestSession();
        session.setUserId(userId);
        session.setControlFail(req.getControlFail());
        session.setRedFail(req.getRedFail());
        session.setGreenFail(req.getGreenFail());
        session.setVanishingSeen(req.getVanishingSeen());
        session.setTotalCorrect(req.getTotalCorrect());
        session.setTotalSeen(req.getTotalSeen());
        session.setPrediction((String) result.get("prediction"));
        session.setConfidence(((Number) result.get("confidence")).doubleValue());

        // Safely convert scores — Jackson may return Integer or Double per value
        @SuppressWarnings("unchecked")
        Map<String, Object> rawScores = (Map<String, Object>) result.get("scores");
        Map<String, Double> scores = new HashMap<>();
        if (rawScores != null) {
            rawScores.forEach((k, v) -> scores.put(k, ((Number) v).doubleValue()));
        }
        session.setScores(scores);

        return testSessionRepository.save(session);
    }

    public List<TestSession> getUserHistory(String userId) {
        return testSessionRepository.findByUserIdOrderByTakenAtDesc(userId);
    }
}
