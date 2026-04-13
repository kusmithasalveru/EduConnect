package com.educonnect.backend.service;

import com.educonnect.backend.dto.trust.TrustScoreResponse;

public interface TrustScoreService {
    TrustScoreResponse recalculateForCurrentUser();
}
