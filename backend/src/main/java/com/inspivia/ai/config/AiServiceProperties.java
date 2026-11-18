package com.inspivia.ai.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

/**
 * Connection settings for the independent Python AI service.
 * Bound from {@code inspivia.ai.*}; values come from environment variables, never from source.
 */
@Validated
@ConfigurationProperties(prefix = "inspivia.ai")
public record AiServiceProperties(
        @NotBlank String baseUrl,
        @NotBlank String serviceKey,
        @NotNull @DefaultValue("2s") Duration connectTimeout,
        @NotNull @DefaultValue("30s") Duration readTimeout,
        @Min(0) @Max(20) @DefaultValue("10") int maxHistoryMessages) {
}
