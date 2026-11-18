package com.inspivia.ai.exception;

/** Conversation does not exist or belongs to another user (deliberately indistinguishable). Maps to 404. */
public class AiConversationNotFoundException extends RuntimeException {
    public AiConversationNotFoundException() {
        super("Conversation not found");
    }
}
