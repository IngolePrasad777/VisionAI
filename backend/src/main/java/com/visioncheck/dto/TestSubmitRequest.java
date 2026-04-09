package com.visioncheck.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class TestSubmitRequest {
    @Min(0) private int controlFail;
    @Min(0) private int redFail;
    @Min(0) private int greenFail;
    @Min(0) private int vanishingSeen;
    @Min(0) private int totalCorrect;
    @Min(1) private int totalSeen;
}
