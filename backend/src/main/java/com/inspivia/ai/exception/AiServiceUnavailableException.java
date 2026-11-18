package com.inspivia.ai.exception;

/** AI service unreachable, timed out, rate-limited or returned 5xx. Maps to HTTP 503. */
public class AiServiceUnavailableException extends RuntimeException {
    public AiServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
