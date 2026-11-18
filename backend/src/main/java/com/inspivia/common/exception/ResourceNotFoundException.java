package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "NOT_FOUND", message);
    }

    public ResourceNotFoundException(String resource, String id) {
        super(HttpStatus.NOT_FOUND, "NOT_FOUND", resource + " not found with id: " + id);
    }
}
