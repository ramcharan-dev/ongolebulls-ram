package dev.ongolebulls.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import dev.ongolebulls.service.AuthService;

@Controller
public class PasswordResetController {

    private final AuthService authService;

    // ✅ constructor injection (Spring will provide AuthService automatically)
    public PasswordResetController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token, Model model) {
        model.addAttribute("token", token);
        return "reset-password"; // looks for reset-password.html in templates/
    }

    @PostMapping("/reset-password")
    public String handleResetPassword(
            @RequestParam("token") String token,
            @RequestParam("password") String password,
            Model model) {

        // ✅ instance call instead of static
        boolean result = authService.resetPassword(token, password);

        if (result) {
            model.addAttribute("message", "Password successfully reset!");
            return "sign-in";
        } else {
            model.addAttribute("error", "Invalid or expired token.");
            return "reset-password";
        }
    }

}
