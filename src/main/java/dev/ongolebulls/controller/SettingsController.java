package dev.ongolebulls.controller;

import dev.ongolebulls.model.Settings;
import dev.ongolebulls.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    // Get all settings
    @GetMapping
    public List<Settings> getAllSettings() {
        return settingsService.getAll();
    }

    // Get a setting by ID
    @GetMapping("/{id}")
    public ResponseEntity<Settings> getSettingById(@PathVariable Long id) {
        Optional<Settings> settingOpt = settingsService.getById(id);
        return settingOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new setting
    @PostMapping
    public Settings createSetting(@RequestBody Settings settings) {
        return settingsService.create(settings);
    }

    // Update existing setting
    @PutMapping("/{id}")
    public ResponseEntity<Settings> updateSetting(@PathVariable Long id, @RequestBody Settings updatedSettings) {
        try {
            Settings updated = settingsService.update(id, updatedSettings);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete setting
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSetting(@PathVariable Long id) {
        try {
            settingsService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
