package dev.ongolebulls.controller;

import dev.ongolebulls.model.Settings;
import dev.ongolebulls.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        if (settings == null) {
            throw new IllegalArgumentException("Settings payload is required");
        }
        return settingsService.create(settings);
    }

    // Update existing setting
    @PutMapping("/{id}")
    public ResponseEntity<Settings> updateSetting(@PathVariable Long id, @RequestBody Settings updatedSettings) {
        if (updatedSettings == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Settings updated = settingsService.update(id, updatedSettings);
            return ResponseEntity.ok(updated);
        }
        catch (RuntimeException e) {
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

    // Upload favicon file
    @PostMapping("/{id}/upload-favicon")
    public ResponseEntity<Map<String, String>> uploadFavicon(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Save file to assets directory
            String fileName = "favicon_" + System.currentTimeMillis() + "_" + 
                             StringUtils.cleanPath(file.getOriginalFilename());
            Path uploadPath = Paths.get("src/main/resources/static/assets/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), 
                      StandardCopyOption.REPLACE_EXISTING);

            // Update settings with favicon URL
            Optional<Settings> settingsOpt = settingsService.getById(id);
            if (settingsOpt.isPresent()) {
                Settings settings = settingsOpt.get();
                settings.setFaviconUrl("/assets/" + fileName);
                settingsService.update(id, settings);

                Map<String, String> response = new HashMap<>();
                response.put("faviconUrl", "/assets/" + fileName);
                response.put("message", "Favicon uploaded successfully");
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(404).body(Map.of("error", "Settings not found"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Unable to upload favicon: " + e.getMessage()));
        }
    }
}
