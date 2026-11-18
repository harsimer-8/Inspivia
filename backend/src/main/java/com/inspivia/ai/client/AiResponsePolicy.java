package com.inspivia.ai.client;

import com.inspivia.ai.contract.AiContract;
import com.inspivia.ai.exception.AiInvalidResponseException;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * Checks that go beyond field-level validation, plus sanitising of model-generated content.
 * Not AI logic: it only enforces the contract and keeps unsafe values away from the frontend.
 */
final class AiResponsePolicy {
    private AiResponsePolicy() {}

    static void requireSameRequestId(UUID expected, UUID actual) {
        if (!expected.equals(actual)) {
            throw new AiInvalidResponseException("AI response request_id does not match the request");
        }
    }

    static AiContract.RoadmapResponse apply(AiContract.RoadmapResponse r) {
        List<AiContract.RoadmapStep> steps = r.steps();
        for (int i = 0; i < steps.size(); i++) {
            if (steps.get(i).position() != i + 1) {
                throw new AiInvalidResponseException("Roadmap step positions must be contiguous from 1");
            }
        }
        List<AiContract.RoadmapStep> cleaned = steps.stream()
                .map(s -> new AiContract.RoadmapStep(s.position(), s.title(), s.description(), s.estimatedWeeks(),
                        s.skills(), s.resources().stream().filter(res -> isHttpUrl(res.url())).toList()))
                .toList();
        return new AiContract.RoadmapResponse(r.requestId(), r.title(), r.summary(), cleaned, r.disclaimer());
    }

    static AiContract.ProjectRecommendationResponse apply(AiContract.ProjectRecommendationResponse r) {
        for (AiContract.ProjectIdea p : r.projects()) {
            List<AiContract.Milestone> ms = p.milestones();
            for (int i = 0; i < ms.size(); i++) {
                if (ms.get(i).position() != i + 1) {
                    throw new AiInvalidResponseException("Milestone positions must be contiguous from 1");
                }
            }
        }
        return r;
    }

    /** Only absolute http(s) links survive; blocks javascript:, data:, file: and relative values. */
    static boolean isHttpUrl(String value) {
        try {
            URI uri = new URI(value.trim());
            String scheme = uri.getScheme();
            return uri.getHost() != null && ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme));
        } catch (Exception e) {
            return false;
        }
    }
}
