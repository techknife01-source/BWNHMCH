package com.homeopathy.college.service;

public interface MailService {

    void sendWelcomeEmail(String toEmail, String fullName, String role);

    void sendOtpEmail(String toEmail, String otpCode);

    void sendPasswordResetConfirmation(String toEmail);
}
