package dev.ongolebulls.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ContactViewController {

    @GetMapping("/contact")
    public String showContactForm() {
        return "contact"; // Looks for contact.html in src/main/resources/templates/
    }
}
