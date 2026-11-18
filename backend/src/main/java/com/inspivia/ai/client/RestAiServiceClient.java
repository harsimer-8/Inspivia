package com.inspivia.ai.client;

import com.inspivia.ai.contract.AiContract;
import com.inspivia.ai.exception.AiInvalidResponseException;
import com.inspivia.ai.exception.AiServiceUnavailableException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * HTTP implementation of {@link AiServiceClient}.
 * Failure mapping: network/timeout/429/5xx -> {@link AiServiceUnavailableException} (503);
 * other 4xx, unreadable JSON, constraint violations, wrong request_id -> {@link AiInvalidResponseException} (502).
 * Request/response bodies are never logged (they contain student data and model output).
 */
@Component
public class RestAiServiceClient implements AiServiceClient {
    private static final Logger log = LoggerFactory.getLogger(RestAiServiceClient.class);
    static final String REQUEST_ID_HEADER = "X-Request-Id";

    private final RestClient rest;
    private final Validator validator;

    public RestAiServiceClient(RestClient aiRestClient, Validator validator) {
        this.rest = aiRestClient;
        this.validator = validator;
    }

    @Override
    public AiContract.ChatResponse chat(AiContract.ChatRequest request) {
        AiContract.ChatResponse res = post("/api/v1/ai/chat", request.requestId(), request, AiContract.ChatResponse.class);
        AiResponsePolicy.requireSameRequestId(request.requestId(), res.requestId());
        return res;
    }

    @Override
    public AiContract.RoadmapResponse roadmap(AiContract.RoadmapRequest request) {
        AiContract.RoadmapResponse res = post("/api/v1/ai/roadmap", request.requestId(), request, AiContract.RoadmapResponse.class);
        AiResponsePolicy.requireSameRequestId(request.requestId(), res.requestId());
        return AiResponsePolicy.apply(res);
    }

    @Override
    public AiContract.ProjectRecommendationResponse recommendProjects(AiContract.ProjectRecommendationRequest request) {
        AiContract.ProjectRecommendationResponse res = post("/api/v1/ai/project-recommendations", request.requestId(),
                request, AiContract.ProjectRecommendationResponse.class);
        AiResponsePolicy.requireSameRequestId(request.requestId(), res.requestId());
        return AiResponsePolicy.apply(res);
    }

    @Override
    public AiHealth health() {
        try {
            AiContract.HealthResponse h = rest.get().uri("/health").retrieve().body(AiContract.HealthResponse.class);
            return h != null && "ok".equalsIgnoreCase(h.status()) ? new AiHealth(true, h.version()) : AiHealth.down();
        } catch (RuntimeException e) {
            log.warn("AI health check failed: {}", e.getClass().getSimpleName());
            return AiHealth.down();
        }
    }

    private <Req, Res> Res post(String path, UUID requestId, Req body, Class<Res> type) {
        validate(body, "request");
        Res res;
        try {
            res = rest.post().uri(path)
                    .header(REQUEST_ID_HEADER, requestId.toString())
                    .body(body)
                    .retrieve()
                    .body(type);
        } catch (ResourceAccessException e) {
            log.warn("AI service unreachable or timed out path={} requestId={}", path, requestId);
            throw new AiServiceUnavailableException("AI service is unreachable or timed out", e);
        } catch (RestClientResponseException e) {
            HttpStatusCode status = e.getStatusCode();
            log.warn("AI service returned status={} path={} requestId={}", status.value(), path, requestId);
            if (status.is5xxServerError() || status.value() == 429) {
                throw new AiServiceUnavailableException("AI service is unavailable (" + status.value() + ")", e);
            }
            throw new AiInvalidResponseException("AI service rejected the request (" + status.value() + ")", e);
        } catch (RestClientException e) {
            log.warn("AI service response unreadable path={} requestId={}", path, requestId);
            throw new AiInvalidResponseException("AI service returned an unreadable response", e);
        }
        if (res == null) {
            throw new AiInvalidResponseException("AI service returned an empty response");
        }
        validate(res, "response");
        return res;
    }

    private <T> void validate(T value, String what) {
        Set<ConstraintViolation<T>> violations = validator.validate(value);
        if (!violations.isEmpty()) {
            // Property paths only: values may contain personal data or model output.
            String paths = violations.stream().map(v -> v.getPropertyPath().toString()).sorted()
                    .limit(10).collect(Collectors.joining(", "));
            if ("request".equals(what)) {
                throw new IllegalStateException("Invalid AI " + what + " built by backend: " + paths);
            }
            throw new AiInvalidResponseException("AI " + what + " violates the contract at: " + paths);
        }
    }
}
