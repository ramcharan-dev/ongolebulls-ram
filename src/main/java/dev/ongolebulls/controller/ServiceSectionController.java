package dev.ongolebulls.controller;

import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.service.ServiceSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-sections")
@CrossOrigin
public class ServiceSectionController {

    @Autowired
    private ServiceSectionService service;

    @GetMapping("/service/{serviceId}")
    public List<ServiceSection> getByService(@PathVariable String serviceId) {
        return service.getByService(serviceId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceSection> getById(@PathVariable String id) {
        ServiceSection found = service.getById(id);
        return found != null ? ResponseEntity.ok(found) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ServiceSection> create(@RequestBody ServiceSection s) {
        return ResponseEntity.ok(service.create(s));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceSection> update(@PathVariable String id, @RequestBody ServiceSection s) {
        ServiceSection updated = service.update(id, s);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
