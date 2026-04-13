package com.educonnect.backend.controller;

import com.educonnect.backend.dto.trust.TrustScoreResponse;
import com.educonnect.backend.service.TrustScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trust-score")
@RequiredArgsConstructor
public class TrustScoreController {

    private final TrustScoreService trustScoreService;

    @PostMapping("/recalculate")
    public ResponseEntity<TrustScoreResponse> recalculate() {
        return ResponseEntity.ok(trustScoreService.recalculateForCurrentUser());
    }
}
