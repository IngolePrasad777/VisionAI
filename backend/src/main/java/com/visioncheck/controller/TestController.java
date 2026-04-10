package com.visioncheck.controller;

import com.visioncheck.dto.TestSubmitRequest;
import com.visioncheck.model.TestSession;
import com.visioncheck.repository.UserRepository;
import com.visioncheck.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;
    private final UserRepository userRepository;

    // Submit test responses → get prediction
    @PostMapping("/submit")
    public ResponseEntity<TestSession> submit(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody TestSubmitRequest req) {

        // userId is null when submitted anonymously (no JWT)
        String userId = null;
        if (email != null) {
            userId = userRepository.findByEmail(email)
                    .map(u -> u.getId())
                    .orElse(null);
        }

        TestSession session = testService.submitTest(userId, req);
        return ResponseEntity.ok(session);
    }

    // Get current user's test history
    @GetMapping("/history")
    public ResponseEntity<List<TestSession>> history(@AuthenticationPrincipal String email) {
        String userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(testService.getUserHistory(userId));
    }
}
