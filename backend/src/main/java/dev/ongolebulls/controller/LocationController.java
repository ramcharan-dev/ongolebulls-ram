package dev.ongolebulls.controller;

import dev.ongolebulls.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public endpoints that power the State/District dropdowns used during
 * partner registration and admin RM creation.
 *
 * Both endpoints are intentionally public (no auth) because they are called
 * from the pre-login Partner Registration page.
 */
@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    /**
     * GET /api/locations/states
     * Returns all distinct state names sorted alphabetically.
     */
    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates() {
        return ResponseEntity.ok(locationService.getAllStates());
    }

    /**
     * GET /api/locations/districts?state=Karnataka
     * Returns all districts for the given state, sorted alphabetically.
     * Empty list if the state is blank or unknown.
     */
    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistricts(@RequestParam String state) {
        return ResponseEntity.ok(locationService.getDistrictsByState(state));
    }
}
