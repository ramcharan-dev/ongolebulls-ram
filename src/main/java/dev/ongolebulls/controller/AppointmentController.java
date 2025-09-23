package dev.ongolebulls.controller;

import dev.ongolebulls.dto.AppointmentRequest;
import dev.ongolebulls.model.Appointment;
import dev.ongolebulls.service.AppointmentService;
import dev.ongolebulls.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {


    private final AppointmentService service;


    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> book(@Valid @RequestBody AppointmentRequest request) {
        Appointment saved = service.book(request);
        return ResponseEntity.ok(ApiResponse.ok(
                "Your appointment has been successfully booked! Our team will connect with you shortly.",
                saved
        ));
    }
}