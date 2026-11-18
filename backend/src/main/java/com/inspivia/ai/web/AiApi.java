package com.inspivia.ai.web;

import com.inspivia.ai.contract.AiContract;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Frontend-facing DTOs (camelCase, served by Spring Boot). Independent of the internal snake_case contract. */
public final class AiApi {
    private AiApi() {}

    public record ChatRequest(UUID conversationId, @NotBlank @Size(max = 4000) String message) {}

    public record ChatResult(UUID conversationId, String reply, List<String> suggestedFollowUps, String disclaimer) {}

    public record RoadmapRequest(
            @NotBlank @Size(max = 80) String domain,
            @Min(4) @Max(52) int durationWeeks,
            @Min(1) @Max(40) int hoursPerWeek) {}

    /** A proposal only. Persisting a roadmap is a separate, explicit student action handled by the roadmap module. */
    public record RoadmapResult(
            String title, String summary, List<AiContract.RoadmapStep> steps, String disclaimer, Instant generatedAt) {}

    public record ProjectRecommendationRequest(
            @Size(max = 80) String domain,
            AiContract.Level difficulty,
            @Min(1) @Max(5) Integer count) {}

    public record ProjectRecommendationResult(
            List<AiContract.ProjectIdea> projects, String disclaimer, Instant generatedAt) {}

    public record AiStatus(boolean available, String version) {}
}
