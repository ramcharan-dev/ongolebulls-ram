package dev.ongolebulls.controller;

import dev.ongolebulls.model.Contact;
import dev.ongolebulls.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//package dev.ongolebulls.controller;
//
//import dev.ongolebulls.model.Contact;
//import dev.ongolebulls.service.ContactService;
//import jakarta.mail.MessagingException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/contact")
//@RequiredArgsConstructor
//public class ContactController {
//
//    private final ContactService contactService;
//
//    @PostMapping
//    public ResponseEntity<?> submitContact(@RequestBody Contact contact) {
//        try {
//            contactService.saveAndSendEmail(contact);
//            return ResponseEntity.ok("{\"message\": \"Contact form submitted successfully!\"}");
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to send email.\"}");
//        }
//    }
//}
@CrossOrigin(origins = {"http://localhost:8085", "https://www.ongolebullsinvest.com"}) // Allow local and production frontend
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody Contact contact) {
        try {
            contactService.saveAndSendEmail(contact);
            return ResponseEntity.ok("{\"message\": \"Contact form submitted successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to send email.\"}");
        }
    }
}
