package com.visioncheck.service;

import com.visioncheck.dto.TestSubmitRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MlService {

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    // Single shared instance — RestTemplate is thread-safe
    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> predict(TestSubmitRequest req) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("control_fail", req.getControlFail());
        payload.put("red_fail", req.getRedFail());
        payload.put("green_fail", req.getGreenFail());
        payload.put("vanishing_seen", req.getVanishingSeen());
        payload.put("total_correct", req.getTotalCorrect());
        payload.put("total_seen", req.getTotalSeen());

        try {
            Map<String, Object> response = restTemplate.postForObject(
                    mlServiceUrl + "/predict", payload, Map.class);
            if (response == null) {
                throw new RuntimeException("ML service returned empty response");
            }
            return response;
        } catch (ResourceAccessException e) {
            throw new RuntimeException("ML service is unavailable. Please try again later.", e);
        }
    }
}
