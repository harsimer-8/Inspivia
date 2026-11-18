package com.inspivia.ai.web;

import com.inspivia.ai.service.AiGatewayService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Frontend-facing AI endpoints. Authentication/authorisation happen here (Spring owns them);
 * the Python service is never reachable from the browser. Requires method security to be enabled in Stage 3.
 * The JWT subject is the user id (see docs/02-architecture.md).
 */
@RestController
@RequestMapping("/api/v1/ai")
@PreAuthorize("hasRole('STUDENT')")
public class AiController {
    private final AiGatewayService gateway;

    public AiController(AiGatewayService gateway) {
        this.gateway = gateway;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiApi.ChatResult> chat(@Valid @RequestBody AiApi.ChatRequest request, Authentication auth) {
        return ResponseEntity.ok(gateway.chat(userId(auth), request));
    }

    @PostMapping("/roadmap")
    public ResponseEntity<AiApi.RoadmapResult> roadmap(@Valid @RequestBody AiApi.RoadmapRequest request, Authentication auth) {
        return ResponseEntity.ok(gateway.roadmap(userId(auth), request));
    }

    @PostMapping("/project-recommendations")
    public ResponseEntity<AiApi.ProjectRecommendationResult> projectRecommendations(
            @Valid @RequestBody AiApi.ProjectRecommendationRequest request, Authentication auth) {
        return ResponseEntity.ok(gateway.recommendProjects(userId(auth), request));
    }

    /** Admin-only visibility into whether the AI service is reachable. */
    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public AiApi.AiStatus status() {
        return gateway.status();
    }

    private static UUID userId(Authentication auth) {
        return UUID.fromString(auth.getName());
    }
}
