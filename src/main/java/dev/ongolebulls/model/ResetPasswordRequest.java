package dev.ongolebulls.model;

public class ResetPasswordRequest {
    private String resetUsername;
    private String newPassword;

    // Getters and Setters
    public String getResetUsername() {
        return resetUsername;
    }

    public void setResetUsername(String resetUsername) {
        this.resetUsername = resetUsername;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}