package dev.ongolebulls.controller;

import dev.ongolebulls.model.Service;
import dev.ongolebulls.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin
public class ServiceController {

    @Autowired
    private ServiceService service;

    @GetMapping
    public List<Service> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Service> create(@RequestBody Service s) {
        return ResponseEntity.ok(service.create(s));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> update(@PathVariable String id,
                                          @RequestBody Service s) {
        return ResponseEntity.ok(service.update(id, s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Service> getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
