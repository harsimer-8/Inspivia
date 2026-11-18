package com.inspivia.ai.web;

import com.inspivia.ai.exception.AiConversationNotFoundException;
import com.inspivia.ai.exception.AiInvalidResponseException;
import com.inspivia.ai.exception.AiServiceUnavailableException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Maps AI failures to RFC 7807 problems. Messages are deliberately generic: internal details
 * (URLs, keys, raw model output) never reach the frontend.
 */
@RestControllerAdvice(assignableTypes = AiController.class)
public class AiExceptionHandler {

    @ExceptionHandler(AiServiceUnavailableException.class)
    ResponseEntity<ProblemDetail> unavailable(AiServiceUnavailableException e) {
        ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.SERVICE_UNAVAILABLE,
                "The AI assistant is temporarily unavailable. Please try again shortly.");
        p.setTitle("AI service unavailable");
        p.setProperty("code", "AI_UNAVAILABLE");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).header(HttpHeaders.RETRY_AFTER, "10").body(p);
    }

    @ExceptionHandler(AiInvalidResponseException.class)
    ResponseEntity<ProblemDetail> invalid(AiInvalidResponseException e) {
        ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_GATEWAY,
                "The AI assistant returned an unusable answer. Please try again.");
        p.setTitle("Invalid AI response");
        p.setProperty("code", "AI_INVALID_RESPONSE");
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(p);
    }

    @ExceptionHandler(AiConversationNotFoundException.class)
    ResponseEntity<ProblemDetail> notFound(AiConversationNotFoundException e) {
        ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Conversation not found");
        p.setTitle("Not found");
        p.setProperty("code", "CONVERSATION_NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(p);
    }
}
