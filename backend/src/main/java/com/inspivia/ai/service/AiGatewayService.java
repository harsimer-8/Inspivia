package com.inspivia.ai.service;

import com.inspivia.ai.client.AiServiceClient;
import com.inspivia.ai.config.AiServiceProperties;
import com.inspivia.ai.contract.AiContract;
import com.inspivia.ai.web.AiApi;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Orchestrates one AI request: gather student data -> build contract payload -> call the AI service ->
 * return a frontend-shaped result. Contains no prompts and no AI decisions.
 * No database transaction is held open across the HTTP call; persistence happens afterwards in the store.
 */
@Service
public class AiGatewayService {
    private static final String DEFAULT_LOCALE = "en";

    private final AiServiceClient client;
    private final StudentContextProvider students;
    private final AiConversationStore conversations;
    private final AiServiceProperties props;

    public AiGatewayService(AiServiceClient client, StudentContextProvider students,
                            AiConversationStore conversations, AiServiceProperties props) {
        this.client = client;
        this.students = students;
        this.conversations = conversations;
        this.props = props;
    }

    public AiApi.ChatResult chat(UUID userId, AiApi.ChatRequest in) {
        UUID conversationId = conversations.resolveOrCreate(userId, in.conversationId());
        List<AiContract.ChatTurn> history = conversations.recentTurns(conversationId, props.maxHistoryMessages());

        AiContract.ChatRequest req = new AiContract.ChatRequest(
                UUID.randomUUID(), students.forUser(userId), history, in.message().strip(), DEFAULT_LOCALE);
        AiContract.ChatResponse res = client.chat(req);

        // Stored only after a valid reply, so a failed AI call leaves no half-finished exchange behind.
        conversations.appendExchange(conversationId, req.message(), res.reply());
        return new AiApi.ChatResult(conversationId, res.reply(), res.suggestedFollowUps(), res.disclaimer());
    }

    public AiApi.RoadmapResult roadmap(UUID userId, AiApi.RoadmapRequest in) {
        AiContract.RoadmapRequest req = new AiContract.RoadmapRequest(
                UUID.randomUUID(), students.forUser(userId), in.domain().strip(), in.durationWeeks(), in.hoursPerWeek());
        AiContract.RoadmapResponse res = client.roadmap(req);
        return new AiApi.RoadmapResult(res.title(), res.summary(), res.steps(), res.disclaimer(), Instant.now());
    }

    public AiApi.ProjectRecommendationResult recommendProjects(UUID userId, AiApi.ProjectRecommendationRequest in) {
        AiContract.StudentContext ctx = students.forUser(userId);
        String domain = (in.domain() != null && !in.domain().isBlank()) ? in.domain().strip() : ctx.selectedDomain();
        AiContract.ProjectRecommendationRequest req = new AiContract.ProjectRecommendationRequest(
                UUID.randomUUID(), ctx, domain, in.difficulty(),
                in.count() != null ? in.count() : 3, students.enrolledProjectTitles(userId));
        AiContract.ProjectRecommendationResponse res = client.recommendProjects(req);
        return new AiApi.ProjectRecommendationResult(res.projects(), res.disclaimer(), Instant.now());
    }

    public AiApi.AiStatus status() {
        AiServiceClient.AiHealth h = client.health();
        return new AiApi.AiStatus(h.available(), h.version());
    }
}
