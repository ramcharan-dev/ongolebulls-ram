//package dev.ongolebulls.controller;
//
//import dev.ongolebulls.model.ServiceSection;
//import dev.ongolebulls.service.ServiceSectionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@CrossOrigin
//public class ServiceSectionController {
//
//    @Autowired
//    private ServiceSectionService service;
//
//    // =========================================================
//    // ✅ FRONTEND-COMPATIBLE ENDPOINTS (IMPORTANT)
//    // =========================================================
//
//    // ✔ Fixes: GET /api/services/{serviceId}/sections
//    @GetMapping("/api/services/{serviceId}/sections")
//    public List<ServiceSection> getSectionsByService(@PathVariable String serviceId) {
//        return service.getByService(serviceId);
//    }
//
//    // ✔ Fixes: GET /api/sections
//    @GetMapping("/api/sections")
//    public List<ServiceSection> getAllSections() {
//        return service.getAll();
//    }
//
//    // ✔ Fixes: POST /api/sections
//    @PostMapping("/api/sections")
//    public ResponseEntity<ServiceSection> createSection(@RequestBody ServiceSection s) {
//        return ResponseEntity.ok(service.create(s));
//    }
//
//    // =========================================================
//    // ✅ EXISTING ENDPOINTS (UNCHANGED)
//    // =========================================================
//
//    @GetMapping("/api/service-sections/service/{serviceId}")
//    public List<ServiceSection> getByServiceOld(@PathVariable String serviceId) {
//        return service.getByService(serviceId);
//    }
//
//    @GetMapping("/api/service-sections/{id}")
//    public ResponseEntity<ServiceSection> getById(@PathVariable String id) {
//        ServiceSection found = service.getById(id);
//        return found != null
//                ? ResponseEntity.ok(found)
//                : ResponseEntity.notFound().build();
//    }
//
//    @PostMapping("/api/service-sections")
//    public ResponseEntity<ServiceSection> createOld(@RequestBody ServiceSection s) {
//        return ResponseEntity.ok(service.create(s));
//    }
//
//    @PutMapping("/api/service-sections/{id}")
//    public ResponseEntity<ServiceSection> update(
//            @PathVariable String id,
//            @RequestBody ServiceSection s) {
//
//        ServiceSection updated = service.update(id, s);
//        return updated != null
//                ? ResponseEntity.ok(updated)
//                : ResponseEntity.notFound().build();
//    }
//
//    @DeleteMapping("/api/service-sections/{id}")
//    public ResponseEntity<?> delete(@PathVariable String id) {
//        service.delete(id);
//        return ResponseEntity.noContent().build();
//    }
//}
//



package dev.ongolebulls.controller;

import dev.ongolebulls.dto.ServiceSectionRequestDTO;
import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.service.ServiceSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceSectionController {

    @Autowired
    private ServiceSectionService sectionService;

    /* =========================
       READ APIs
    ========================== */

    // Get ALL sections (admin/debug)
    @GetMapping("/service-sections")
    public List<ServiceSection> getAllSections() {
        return sectionService.getAll();
    }

    // Get section by ID
    @GetMapping("/service-sections/{id}")
    public ResponseEntity<ServiceSection> getSectionById(@PathVariable String id) {
        ServiceSection section = sectionService.getById(id);
        return section != null
                ? ResponseEntity.ok(section)
                : ResponseEntity.notFound().build();
    }

    // Get sections by Service
    @GetMapping("/services/{serviceId}/sections")
    public List<ServiceSection> getSectionsByService(@PathVariable String serviceId) {
        return sectionService.getByService(serviceId);
    }

    /* =========================
       CREATE
    ========================== */

    @PostMapping("/services/{serviceId}/sections")
    public ResponseEntity<ServiceSection> createSection(
            @PathVariable String serviceId,
            @RequestBody ServiceSectionRequestDTO dto
    ) {
        ServiceSection created = sectionService.create(serviceId, dto);
        return ResponseEntity.ok(created);
    }

    /* =========================
       UPDATE
    ========================== */

    @PutMapping("/services/{serviceId}/sections/{sectionId}")
    public ResponseEntity<ServiceSection> updateSection(
            @PathVariable String serviceId,
            @PathVariable String sectionId,
            @RequestBody ServiceSectionRequestDTO dto
    ) {
        ServiceSection updated = sectionService.update(sectionId, dto);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    /* =========================
       DELETE
    ========================== */

    @DeleteMapping("/services/{serviceId}/sections/{sectionId}")
    public ResponseEntity<?> deleteSection(
            @PathVariable String serviceId,
            @PathVariable String sectionId
    ) {
        sectionService.delete(sectionId);
        return ResponseEntity.noContent().build();
    }
}

