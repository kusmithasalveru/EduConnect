package com.educonnect.backend.dto.trust;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrustScoreResponse {
    private Long userId;
    private Integer trustScore;
    private String rationale;
}
