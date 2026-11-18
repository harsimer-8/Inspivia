package com.inspivia.ai.service;

import com.inspivia.ai.contract.AiContract;

import java.util.List;
import java.util.UUID;

/**
 * Port implemented in Stage 4 on top of the {@code ai_conversations} / {@code ai_messages} tables.
 * PostgreSQL is the only acceptable backing store; the Python service keeps no state.
 */
public interface AiConversationStore {
    /**
     * Returns the id of an existing conversation owned by {@code userId}, or creates a new one when
     * {@code conversationId} is null.
     *
     * @throws com.inspivia.ai.exception.AiConversationNotFoundException if it does not exist or is owned by someone else
     */
    UUID resolveOrCreate(UUID userId, UUID conversationId);

    /** Most recent {@code limit} turns, oldest first. */
    List<AiContract.ChatTurn> recentTurns(UUID conversationId, int limit);

    /** Persists one user message and one assistant reply atomically (single transaction). */
    void appendExchange(UUID conversationId, String userMessage, String assistantReply);
}
