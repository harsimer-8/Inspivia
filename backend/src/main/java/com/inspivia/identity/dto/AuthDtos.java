package com.inspivia.identity.dto;

import com.inspivia.common.model.Role;
import com.inspivia.common.model.UserStatus;
import jakarta.validation.constraints.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterStudentRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Size(max = 200) String college,
            @NotBlank @Size(max = 120) String degree,
            @NotNull @Min(1) @Max(8) Integer currentYear,
            @Size(max = 2000) String careerGoals,
            UUID selectedDomainId,
            List<UUID> interestDomainIds
    ) {}

    public record RegisterMentorRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Size(max = 120) String professionalTitle,
            @NotBlank @Size(max = 160) String organization,
            @NotNull @Min(0) Integer yearsExperience,
            @Size(max = 2000) String bio,
            @Size(max = 300) String linkedinUrl,
            @Min(1) @Max(50) Integer maxMentees,
            List<UUID> domainIds
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record RefreshTokenRequest(
            String refreshToken
    ) {}

    public record VerifyEmailRequest(
            @NotBlank String token
    ) {}

    public record ResendVerificationRequest(
            @NotBlank @Email String email
    ) {}

    public record ForgotPasswordRequest(
            @NotBlank @Email String email
    ) {}

    public record ResetPasswordRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8, max = 100) String newPassword
    ) {}

    public record AuthResponse(
            String accessToken,
            String refreshToken,
            long expiresInSeconds,
            UserDto user
    ) {}

    public record UserDto(
            UUID id,
            String email,
            String fullName,
            Role role,
            UserStatus status,
            Instant emailVerifiedAt
    ) {}
}
