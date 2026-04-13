package dev.ongolebulls.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Handles only the public reset link from the email and redirects once to React.
 */
@Controller
public class PasswordResetController {

    @GetMapping("/reset-password")
    public String redirectToFrontend(@RequestParam("token") String token) {
        // Single redirect to React reset-password route, preserving the token
        return "redirect:http://localhost:5173/reset-password?token=" + token;
    }
}
