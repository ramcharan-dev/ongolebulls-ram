package dev.ongolebulls.controller;

import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.service.ServiceSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ServiceSectionController {

    @Autowired
    private ServiceSectionService service;

    // =========================================================
    // ✅ FRONTEND-COMPATIBLE ENDPOINTS (IMPORTANT)
    // =========================================================

    // ✔ Fixes: GET /api/services/{serviceId}/sections
    @GetMapping("/api/services/{serviceId}/sections")
    public List<ServiceSection> getSectionsByService(@PathVariable String serviceId) {
        return service.getByService(serviceId);
    }

    // ✔ Fixes: GET /api/sections
    @GetMapping("/api/sections")
    public List<ServiceSection> getAllSections() {
        return service.getAll();
    }

    // ✔ Fixes: POST /api/sections
    @PostMapping("/api/sections")
    public ResponseEntity<ServiceSection> createSection(@RequestBody ServiceSection s) {
        return ResponseEntity.ok(service.create(s));
    }

    // =========================================================
    // ✅ EXISTING ENDPOINTS (UNCHANGED)
    // =========================================================

    @GetMapping("/api/service-sections/service/{serviceId}")
    public List<ServiceSection> getByServiceOld(@PathVariable String serviceId) {
        return service.getByService(serviceId);
    }

    @GetMapping("/api/service-sections/{id}")
    public ResponseEntity<ServiceSection> getById(@PathVariable String id) {
        ServiceSection found = service.getById(id);
        return found != null
                ? ResponseEntity.ok(found)
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/api/service-sections")
    public ResponseEntity<ServiceSection> createOld(@RequestBody ServiceSection s) {
        return ResponseEntity.ok(service.create(s));
    }

    @PutMapping("/api/service-sections/{id}")
    public ResponseEntity<ServiceSection> update(
            @PathVariable String id,
            @RequestBody ServiceSection s) {

        ServiceSection updated = service.update(id, s);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/api/service-sections/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
