package com.visioncheck.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "test_sessions")
public class TestSession {

    @Id
    private String id;

    private String userId;

    // The 6 features derived from user responses
    private int controlFail;
    private int redFail;
    private int greenFail;
    private int vanishingSeen;
    private int totalCorrect;
    private int totalSeen;

    // ML result
    private String prediction;       // Normal, Protanopia, Deuteranopia, RG_Deficient
    private double confidence;
    private Map<String, Double> scores; // per-class probabilities

    private LocalDateTime takenAt = LocalDateTime.now();
}
