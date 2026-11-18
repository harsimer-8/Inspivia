package com.inspivia.common.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String frontendBaseUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${inspivia.mail.from:no-reply@inspivia.local}") String fromAddress,
                        @Value("${inspivia.frontend-base-url:http://localhost:3000}") String frontendBaseUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendBaseUrl + "/verify-email?token=" + token;
        sendEmail(toEmail, "Verify your Inspivia account",
                "Welcome to Inspivia! Please verify your email by clicking the link:\n" + link);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = frontendBaseUrl + "/reset-password?token=" + token;
        sendEmail(toEmail, "Reset your Inspivia password",
                "You requested a password reset. Click the link below to set a new password:\n" + link);
    }

    public void sendNotificationEmail(String toEmail, String subject, String body) {
        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Sent email to {}", to);
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}. Will proceed without blocking.", to, e.getMessage());
        }
    }
}
