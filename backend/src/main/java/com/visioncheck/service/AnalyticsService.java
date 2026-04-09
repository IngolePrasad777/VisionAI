package com.visioncheck.service;

import com.visioncheck.repository.TestSessionRepository;
import com.visioncheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TestSessionRepository testSessionRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getSummary() {
        List<String> labels = List.of("Normal", "Protanopia", "Deuteranopia", "RG_Deficient");

        Map<String, Long> distribution = new HashMap<>();
        for (String label : labels) {
            distribution.put(label, testSessionRepository.countByPrediction(label));
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalTests", testSessionRepository.count());
        summary.put("totalUsers", userRepository.count());
        summary.put("distribution", distribution);

        return summary;
    }
}
