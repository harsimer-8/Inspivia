package com.inspivia.ai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inspivia.ai.config.AiClientConfig;
import com.inspivia.ai.config.AiServiceProperties;
import com.inspivia.ai.contract.AiContract;
import com.inspivia.ai.exception.AiInvalidResponseException;
import com.inspivia.ai.exception.AiServiceUnavailableException;
import com.sun.net.httpserver.HttpServer;
import jakarta.validation.Validation;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Exercises the real production client against a throw-away local HTTP server (no extra test dependencies). */
class RestAiServiceClientTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private HttpServer server;
    private final AtomicReference<String> seenKey = new AtomicReference<>();
    private final AtomicReference<String> seenRequestId = new AtomicReference<>();

    @BeforeEach
    void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.start();
    }

    @AfterEach
    void stop() {
        server.stop(0);
    }

    private RestAiServiceClient client(Duration readTimeout) {
        var props = new AiServiceProperties("http://127.0.0.1:" + server.getAddress().getPort(),
                "test-key", Duration.ofSeconds(1), readTimeout, 10);
        var validator = Validation.buildDefaultValidatorFactory().getValidator();
        return new RestAiServiceClient(AiClientConfig.buildRestClient(props), validator);
    }

    private void stub(String path, int status, long delayMs, Function<JsonNode, String> responder) {
        server.createContext(path, ex -> {
            try {
                seenKey.set(ex.getRequestHeaders().getFirst("X-Service-Key"));
                seenRequestId.set(ex.getRequestHeaders().getFirst("X-Request-Id"));
                JsonNode req = JSON.readTree(ex.getRequestBody().readAllBytes());
                if (delayMs > 0) Thread.sleep(delayMs);
                byte[] body = responder.apply(req).getBytes(StandardCharsets.UTF_8);
                ex.getResponseHeaders().add("Content-Type", "application/json");
                ex.sendResponseHeaders(status, body.length);
                ex.getResponseBody().write(body);
            } catch (Exception e) {
                ex.sendResponseHeaders(500, -1);
            } finally {
                ex.close();
            }
        });
    }

    private static AiContract.StudentContext student() {
        return new AiContract.StudentContext(UUID.randomUUID(), "Asha", "B.Tech CSE", 2,
                List.of("AI"), List.of(new AiContract.SkillLevel("Python", AiContract.Level.BEGINNER)), "ML engineer", null);
    }

    private static AiContract.ChatRequest chatRequest() {
        return new AiContract.ChatRequest(UUID.randomUUID(), student(), List.of(), "How do I start with ML?", "en");
    }

    private static String chatOk(JsonNode req) {
        return "{\"request_id\":\"" + req.get("request_id").asText() + "\",\"reply\":\"Start with Python basics.\","
                + "\"suggested_follow_ups\":[\"What is a good first project?\"],\"disclaimer\":\"Guidance only.\",\"extra\":1}";
    }

    @Test
    void chatSendsServiceKeyAndRequestIdAndParsesSnakeCase() {
        stub("/api/v1/ai/chat", 200, 0, RestAiServiceClientTest::chatOk);
        var req = chatRequest();

        var res = client(Duration.ofSeconds(2)).chat(req);

        assertThat(res.reply()).isEqualTo("Start with Python basics.");
        assertThat(res.suggestedFollowUps()).hasSize(1);
        assertThat(seenKey.get()).isEqualTo("test-key");
        assertThat(seenRequestId.get()).isEqualTo(req.requestId().toString());
    }

    @Test
    void serverErrorBecomesUnavailable() {
        stub("/api/v1/ai/chat", 500, 0, r -> "{\"error\":{\"code\":\"X\",\"message\":\"boom\"}}");
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).chat(chatRequest()))
                .isInstanceOf(AiServiceUnavailableException.class);
    }

    @Test
    void rateLimitBecomesUnavailable() {
        stub("/api/v1/ai/chat", 429, 0, r -> "{}");
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).chat(chatRequest()))
                .isInstanceOf(AiServiceUnavailableException.class);
    }

    @Test
    void readTimeoutBecomesUnavailable() {
        stub("/api/v1/ai/chat", 200, 1500, RestAiServiceClientTest::chatOk);
        assertThatThrownBy(() -> client(Duration.ofMillis(300)).chat(chatRequest()))
                .isInstanceOf(AiServiceUnavailableException.class);
    }

    @Test
    void connectionRefusedBecomesUnavailable() {
        int port = server.getAddress().getPort();
        server.stop(0);
        var props = new AiServiceProperties("http://127.0.0.1:" + port, "k", Duration.ofMillis(500), Duration.ofSeconds(1), 10);
        var c = new RestAiServiceClient(AiClientConfig.buildRestClient(props), Validation.buildDefaultValidatorFactory().getValidator());
        assertThatThrownBy(() -> c.chat(chatRequest())).isInstanceOf(AiServiceUnavailableException.class);
        assertThat(c.health().available()).isFalse();
    }

    @Test
    void malformedJsonBecomesInvalidResponse() {
        stub("/api/v1/ai/chat", 200, 0, r -> "not json");
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).chat(chatRequest()))
                .isInstanceOf(AiInvalidResponseException.class);
    }

    @Test
    void missingRequiredFieldBecomesInvalidResponse() {
        stub("/api/v1/ai/chat", 200, 0, r -> "{\"request_id\":\"" + r.get("request_id").asText() + "\",\"reply\":\"hi\"}");
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).chat(chatRequest()))
                .isInstanceOf(AiInvalidResponseException.class);
    }

    @Test
    void mismatchedRequestIdIsRejected() {
        stub("/api/v1/ai/chat", 200, 0, r -> chatOk(JSON.createObjectNode().put("request_id", UUID.randomUUID().toString())));
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).chat(chatRequest()))
                .isInstanceOf(AiInvalidResponseException.class);
    }

    @Test
    void unknownEnumValueIsRejected() {
        stub("/api/v1/ai/project-recommendations", 200, 0, r -> "{\"request_id\":\"" + r.get("request_id").asText()
                + "\",\"projects\":[{\"title\":\"t\",\"description\":\"d\",\"difficulty\":\"EXPERT\",\"technologies\":[\"x\"],"
                + "\"estimated_hours\":5,\"milestones\":[{\"position\":1,\"title\":\"m\",\"description\":\"d\"}],\"rationale\":\"r\"}],"
                + "\"disclaimer\":\"d\"}");
        var req = new AiContract.ProjectRecommendationRequest(UUID.randomUUID(), student(), "AI", null, 3, List.of());
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).recommendProjects(req))
                .isInstanceOf(AiInvalidResponseException.class);
    }

    @Test
    void roadmapDropsNonHttpResourceUrls() {
        stub("/api/v1/ai/roadmap", 200, 0, r -> "{\"request_id\":\"" + r.get("request_id").asText()
                + "\",\"title\":\"ML path\",\"summary\":\"s\",\"disclaimer\":\"d\",\"steps\":[{\"position\":1,\"title\":\"Python\","
                + "\"description\":\"d\",\"estimated_weeks\":2,\"skills\":[\"Python\"],\"resources\":["
                + "{\"title\":\"ok\",\"url\":\"https://docs.python.org/3/\",\"type\":\"DOCS\"},"
                + "{\"title\":\"bad\",\"url\":\"javascript:alert(1)\",\"type\":\"OTHER\"}]}]}");
        var req = new AiContract.RoadmapRequest(UUID.randomUUID(), student(), "AI", 12, 6);

        var res = client(Duration.ofSeconds(2)).roadmap(req);

        assertThat(res.steps().get(0).resources()).hasSize(1);
        assertThat(res.steps().get(0).resources().get(0).url()).startsWith("https://");
    }

    @Test
    void roadmapWithGapInStepPositionsIsRejected() {
        stub("/api/v1/ai/roadmap", 200, 0, r -> "{\"request_id\":\"" + r.get("request_id").asText()
                + "\",\"title\":\"t\",\"summary\":\"s\",\"disclaimer\":\"d\",\"steps\":[{\"position\":2,\"title\":\"a\","
                + "\"description\":\"d\",\"estimated_weeks\":1,\"skills\":[],\"resources\":[]}]}");
        var req = new AiContract.RoadmapRequest(UUID.randomUUID(), student(), "AI", 12, 6);
        assertThatThrownBy(() -> client(Duration.ofSeconds(2)).roadmap(req)).isInstanceOf(AiInvalidResponseException.class);
    }
}
