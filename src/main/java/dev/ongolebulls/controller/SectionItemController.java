//package dev.ongolebulls.controller;
//
//import dev.ongolebulls.model.SectionItem;
//import dev.ongolebulls.service.SectionItemService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/section-items")
//@CrossOrigin
//public class SectionItemController {
//
//    @Autowired
//    private SectionItemService service;
//
//    @GetMapping("/section/{sectionId}")
//    public List<SectionItem> getBySection(@PathVariable String sectionId) {
//        return service.getBySection(sectionId);
//    }
//
//    @PostMapping
//    public ResponseEntity<SectionItem> create(@RequestBody SectionItem s) {
//        return ResponseEntity.ok(service.create(s));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<SectionItem> update(@PathVariable String id, @RequestBody SectionItem s) {
//        SectionItem updated = service.update(id, s);
//        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> delete(@PathVariable String id) {
//        service.delete(id);
//        return ResponseEntity.noContent().build();
//    }
//}
package dev.ongolebulls.controller;

import dev.ongolebulls.model.SectionItem;
import dev.ongolebulls.service.SectionItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/section-items")
@CrossOrigin
public class SectionItemController {

    @Autowired
    private SectionItemService service;

    // Get all items
    @GetMapping
    public List<SectionItem> getAll() {
        return service.getAll();
    }

    // Get item by ID
    @GetMapping("/{id}")
    public ResponseEntity<SectionItem> getById(@PathVariable String id) {
        SectionItem found = service.getById(id);
        return found != null ? ResponseEntity.ok(found) : ResponseEntity.notFound().build();
    }

    // Get items by Section ID
    @GetMapping("/section/{sectionId}")
    public List<SectionItem> getBySection(@PathVariable String sectionId) {
        return service.getBySection(sectionId);
    }

    // Create item under a specific section
    @PostMapping("/section/{sectionId}")
    public ResponseEntity<SectionItem> create(@PathVariable String sectionId,
                                              @RequestBody SectionItem item) {
        SectionItem created = service.create(sectionId, item);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.notFound().build();
    }

    // Update item
    @PutMapping("/{id}")
    public ResponseEntity<SectionItem> update(@PathVariable String id,
                                              @RequestBody SectionItem item) {
        SectionItem updated = service.update(id, item);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // Delete item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

