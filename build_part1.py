import os
import sys

BASE_DIR = r"c:\Users\HP\Desktop\HeatShield-Prototype-main.worktrees\inspivia-backend\inspivia\backend\src\main\java\com\inspivia"

def write(rel_path, content):
    full_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Wrote {rel_path}")

# ==========================================
# 1. COMMON ENUMS
# ==========================================
write("common/model/MentorshipOrigin.java", """
package com.inspivia.common.model;

public enum MentorshipOrigin {
    AUTO,
    ADMIN
}
""")

write("common/model/SessionStatus.java", """
package com.inspivia.common.model;

public enum SessionStatus {
    SCHEDULED,
    COMPLETED,
    CANCELLED,
    NO_SHOW
}
""")

write("common/model/ProjectDifficulty.java", """
package com.inspivia.common.model;

public enum ProjectDifficulty {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED
}
""")

write("common/model/ProjectStatus.java", """
package com.inspivia.common.model;

public enum ProjectStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
}
""")

write("common/model/EnrollmentStatus.java", """
package com.inspivia.common.model;

public enum EnrollmentStatus {
    ACTIVE,
    COMPLETED,
    DROPPED
}
""")

write("common/model/SubmissionStatus.java", """
package com.inspivia.common.model;

public enum SubmissionStatus {
    SUBMITTED,
    CHANGES_REQUESTED,
    APPROVED
}
""")

write("common/model/RoadmapStatus.java", """
package com.inspivia.common.model;

public enum RoadmapStatus {
    ACTIVE,
    ARCHIVED
}
""")

write("common/model/RoadmapSource.java", """
package com.inspivia.common.model;

public enum RoadmapSource {
    AI,
    MENTOR,
    MANUAL
}
""")

write("common/model/RoadmapStepStatus.java", """
package com.inspivia.common.model;

public enum RoadmapStepStatus {
    TODO,
    IN_PROGRESS,
    DONE
}
""")

write("common/model/ContactCategory.java", """
package com.inspivia.common.model;

public enum ContactCategory {
    GENERAL,
    STUDENT_SUPPORT,
    MENTOR_ONBOARDING,
    PARTNERSHIP,
    TECHNICAL_ISSUE,
    FEEDBACK
}
""")

write("common/model/ContactStatus.java", """
package com.inspivia.common.model;

public enum ContactStatus {
    NEW,
    IN_PROGRESS,
    RESOLVED,
    SPAM
}
""")

write("common/model/FeedbackType.java", """
package com.inspivia.common.model;

public enum FeedbackType {
    MENTOR,
    LEARNING,
    PLATFORM,
    ISSUE
}
""")

write("common/model/FeedbackStatus.java", """
package com.inspivia.common.model;

public enum FeedbackStatus {
    OPEN,
    IN_REVIEW,
    RESOLVED,
    DISMISSED
}
""")

write("common/model/ResourceType.java", """
package com.inspivia.common.model;

public enum ResourceType {
    ARTICLE,
    VIDEO,
    COURSE,
    BOOK,
    DOCUMENTATION,
    OTHER
}
""")

write("common/model/OpportunityType.java", """
package com.inspivia.common.model;

public enum OpportunityType {
    INTERNSHIP,
    HACKATHON,
    COMPETITION,
    WORKSHOP,
    RESEARCH
}
""")

write("common/model/PublishStatus.java", """
package com.inspivia.common.model;

public enum PublishStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
}
""")

write("common/model/StudentProjectStatus.java", """
package com.inspivia.common.model;

public enum StudentProjectStatus {
    PLANNED,
    IN_PROGRESS,
    COMPLETED
}
""")

write("common/model/WaitlistStatus.java", """
package com.inspivia.common.model;

public enum WaitlistStatus {
    WAITING,
    MATCHED,
    CANCELLED
}
""")

write("common/model/ReassignmentStatus.java", """
package com.inspivia.common.model;

public enum ReassignmentStatus {
    OPEN,
    APPROVED,
    REJECTED
}
""")

write("common/model/GuidanceKind.java", """
package com.inspivia.common.model;

public enum GuidanceKind {
    NOTE,
    RESOURCE,
    FEEDBACK
}
""")

write("common/model/TeamRole.java", """
package com.inspivia.common.model;

public enum TeamRole {
    OWNER,
    MEMBER
}
""")

write("common/model/ConsentType.java", """
package com.inspivia.common.model;

public enum ConsentType {
    AI_CHAT_HISTORY
}
""")

# ==========================================
# 2. COMMON EXCEPTIONS & HANDLER
# ==========================================
write("common/exception/ApiException.java", """
package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }
}
""")

write("common/exception/BadRequestException.java", """
package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ApiException {
    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }

    public BadRequestException(String code, String message) {
        super(HttpStatus.BAD_REQUEST, code, message);
    }
}
""")

write("common/exception/ResourceNotFoundException.java", """
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
""")

write("common/exception/UnauthorizedException.java", """
package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", message);
    }
}
""")

write("common/exception/ForbiddenException.java", """
package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApiException {
    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, "FORBIDDEN", message);
    }
}
""")

write("common/exception/ConflictException.java", """
package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends ApiException {
    public ConflictException(String message) {
        super(HttpStatus.CONFLICT, "CONFLICT", message);
    }
}
""")

write("common/exception/GlobalExceptionHandler.java", """
package com.inspivia.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ProblemDetail> handleApiException(ApiException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
        pd.setType(URI.create("urn:inspivia:error:" + ex.getCode().toLowerCase()));
        pd.setTitle(ex.getCode());
        pd.setProperty("code", ex.getCode());
        pd.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(ex.getStatus()).body(pd);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        pd.setType(URI.create("urn:inspivia:error:validation"));
        pd.setTitle("VALIDATION_ERROR");
        pd.setProperty("code", "VALIDATION_ERROR");

        Map<String, String> errors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        pd.setProperty("errors", errors);
        pd.setProperty("timestamp", Instant.now());
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleBadCredentials(BadCredentialsException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        pd.setType(URI.create("urn:inspivia:error:invalid_credentials"));
        pd.setTitle("INVALID_CREDENTIALS");
        pd.setProperty("code", "INVALID_CREDENTIALS");
        pd.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(pd);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(AccessDeniedException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Access is denied");
        pd.setType(URI.create("urn:inspivia:error:forbidden"));
        pd.setTitle("FORBIDDEN");
        pd.setProperty("code", "FORBIDDEN");
        pd.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(pd);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGeneric(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An internal error occurred");
        pd.setType(URI.create("urn:inspivia:error:internal"));
        pd.setTitle("INTERNAL_ERROR");
        pd.setProperty("code", "INTERNAL_ERROR");
        pd.setProperty("timestamp", Instant.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(pd);
    }
}
""")

print("Part 1 complete.")
