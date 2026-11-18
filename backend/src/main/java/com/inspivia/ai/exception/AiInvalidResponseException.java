package com.inspivia.ai.exception;

/** AI service answered but the response broke the contract. Maps to HTTP 502. */
public class AiInvalidResponseException extends RuntimeException {
    public AiInvalidResponseException(String message) {
        super(message);
    }

    public AiInvalidResponseException(String message, Throwable cause) {
        super(message, cause);
    }
}
