package com.inspivia.ai.client;

import com.inspivia.ai.contract.AiContract;

/** Port to the Python AI service. The only class family that knows the AI service exists over HTTP. */
public interface AiServiceClient {
    AiContract.ChatResponse chat(AiContract.ChatRequest request);

    AiContract.RoadmapResponse roadmap(AiContract.RoadmapRequest request);

    AiContract.ProjectRecommendationResponse recommendProjects(AiContract.ProjectRecommendationRequest request);

    /** Never throws; returns {@link AiHealth#down()} on any failure. */
    AiHealth health();

    record AiHealth(boolean available, String version) {
        public static AiHealth down() {
            return new AiHealth(false, null);
        }
    }
}
