package dev.ongolebulls.controller;

import dev.ongolebulls.model.SeoSetting;
import dev.ongolebulls.service.SeoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adminseo")
public class SeoController {

    @Autowired
    private SeoService seoService;

    @GetMapping
    public List<SeoSetting> listSeoSettings() {
        return seoService.getAllSeoSettings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeoSetting> getSeoById(@PathVariable Long id) {
        SeoSetting seo = seoService.getSeoById(id);
        if (seo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(seo);
    }

    @PostMapping("/save")
    public ResponseEntity<SeoSetting> saveSeo(@RequestBody SeoSetting seo) {
        SeoSetting saved = seoService.saveSeo(seo);
        return ResponseEntity.ok(saved);
    }



}

