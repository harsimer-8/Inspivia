package com.inspivia.ai.contract;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

/**
 * Java mirror of {@code contracts/ai-service.openapi.yaml}. These records are serialised as snake_case
 * by the AI client's private ObjectMapper. Keep in lock-step with contracts/python/schemas.py.
 * Contains data shapes only; no AI logic.
 */
public final class AiContract {
    private AiContract() {}

    public enum Level { BEGINNER, INTERMEDIATE, ADVANCED }
    public enum Role { USER, ASSISTANT }
    public enum ResourceType { ARTICLE, VIDEO, COURSE, BOOK, DOCS, OTHER }

    public record SkillLevel(@NotBlank @Size(max = 80) String name, @NotNull Level level) {}

    public record StudentContext(
            @NotNull UUID studentId,
            @Size(max = 80) String firstName,
            @Size(max = 120) String degree,
            @Min(1) @Max(8) Integer currentYear,
            @NotNull @Size(max = 20) List<@NotBlank @Size(max = 80) String> interests,
            @NotNull @Size(max = 40) List<@Valid SkillLevel> skills,
            @Size(max = 2000) String careerGoals,
            @Size(max = 80) String selectedDomain) {}

    public record ChatTurn(@NotNull Role role, @NotBlank @Size(max = 8000) String content) {}

    // ---- chat ----
    public record ChatRequest(
            @NotNull UUID requestId,
            @NotNull @Valid StudentContext student,
            @NotNull @Size(max = 20) List<@Valid ChatTurn> history,
            @NotBlank @Size(max = 4000) String message,
            @NotBlank @Size(max = 10) String locale) {}

    public record ChatResponse(
            @NotNull UUID requestId,
            @NotBlank @Size(max = 8000) String reply,
            @NotNull @Size(max = 4) List<@NotBlank @Size(max = 200) String> suggestedFollowUps,
            @NotBlank @Size(max = 500) String disclaimer) {}

    // ---- roadmap ----
    public record RoadmapRequest(
            @NotNull UUID requestId,
            @NotNull @Valid StudentContext student,
            @NotBlank @Size(max = 80) String domain,
            @Min(4) @Max(52) int durationWeeks,
            @Min(1) @Max(40) int hoursPerWeek) {}

    public record Resource(
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 500) String url,
            @NotNull ResourceType type) {}

    public record RoadmapStep(
            @Min(1) int position,
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 2000) String description,
            @Min(1) @Max(52) int estimatedWeeks,
            @NotNull @Size(max = 10) List<@NotBlank @Size(max = 80) String> skills,
            @NotNull @Size(max = 6) List<@Valid Resource> resources) {}

    public record RoadmapResponse(
            @NotNull UUID requestId,
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 2000) String summary,
            @NotNull @Size(min = 1, max = 20) List<@Valid RoadmapStep> steps,
            @NotBlank @Size(max = 500) String disclaimer) {}

    // ---- project recommendations ----
    public record ProjectRecommendationRequest(
            @NotNull UUID requestId,
            @NotNull @Valid StudentContext student,
            @Size(max = 80) String domain,
            Level difficulty,
            @Min(1) @Max(5) int count,
            @NotNull @Size(max = 20) List<@Size(max = 200) String> excludeTitles) {}

    public record Milestone(
            @Min(1) int position,
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 1000) String description) {}

    public record ProjectIdea(
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 3000) String description,
            @NotNull Level difficulty,
            @NotNull @Size(min = 1, max = 12) List<@NotBlank @Size(max = 60) String> technologies,
            @Min(1) @Max(1000) int estimatedHours,
            @NotNull @Size(min = 1, max = 10) List<@Valid Milestone> milestones,
            @NotBlank @Size(max = 1000) String rationale) {}

    public record ProjectRecommendationResponse(
            @NotNull UUID requestId,
            @NotNull @Size(min = 1, max = 5) List<@Valid ProjectIdea> projects,
            @NotBlank @Size(max = 500) String disclaimer) {}

    // ---- health ----
    public record HealthResponse(String status, String service, String version) {}
}
