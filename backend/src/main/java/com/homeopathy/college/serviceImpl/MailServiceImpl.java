package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.constants.AppConstants;
import com.homeopathy.college.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@bwnhmch.com}")
    private String fromEmail;

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String fullName, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to " + AppConstants.INSTITUTION_NAME);
            message.setText("Dear " + fullName + ",\n\n" +
                    "Welcome to " + AppConstants.INSTITUTION_NAME + " Digital Portal.\n" +
                    "Your account has been registered under the role: " + role + ".\n\n" +
                    "Best Regards,\nIT Cell & Principal Desk\n" + AppConstants.INSTITUTION_NAME);

            mailSender.send(message);
            log.info("Welcome email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Could not dispatch welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Verification OTP - " + AppConstants.INSTITUTION_NAME);
            message.setText("Dear User,\n\n" +
                    "Your One-Time Password (OTP) for resetting your portal password is: " + otpCode + "\n\n" +
                    "This code is valid for 10 minutes. Do not share this OTP with anyone.\n\n" +
                    "Regards,\nSecurity Desk, " + AppConstants.INSTITUTION_NAME);

            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Could not dispatch OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    @Override
    public void sendPasswordResetConfirmation(String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Updated Successfully - " + AppConstants.INSTITUTION_NAME);
            message.setText("Dear User,\n\n" +
                    "Your account password for " + AppConstants.INSTITUTION_NAME + " Portal was modified successfully.\n" +
                    "If you did not perform this change, please contact the IT Administrator immediately.\n\n" +
                    "Regards,\nIT Security Cell");

            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not dispatch password reset confirmation to {}: {}", toEmail, e.getMessage());
        }
    }
}
