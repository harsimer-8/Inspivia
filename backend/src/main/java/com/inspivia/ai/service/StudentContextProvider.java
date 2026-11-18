package com.inspivia.ai.service;

import com.inspivia.ai.contract.AiContract;

import java.util.List;
import java.util.UUID;

/**
 * Port implemented by the student module (Stage 4) from PostgreSQL. Keeps the AI layer independent of
 * JPA entities. Implementations must return only the minimal fields in {@link AiContract.StudentContext}
 * (never email, password hash or tokens).
 */
public interface StudentContextProvider {
    /** @param userId the authenticated user's id (JWT subject) */
    AiContract.StudentContext forUser(UUID userId);

    /** Titles of projects the student is already enrolled in, so recommendations avoid repeats. */
    List<String> enrolledProjectTitles(UUID userId);
}
