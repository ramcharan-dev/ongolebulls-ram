package dev.ongolebulls.service;

import dev.ongolebulls.model.Settings;
import dev.ongolebulls.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SettingsService {

    @Autowired
    private SettingsRepository repository;

    public List<Settings> getAll() {
        return repository.findAll();
    }

    public Optional<Settings> getById(Long id) {
        return repository.findById(id);
    }

    public Settings create(Settings settings) {
        return repository.save(settings);
    }

    public Settings update(Long id, Settings updated) {
        Settings existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Settings not found"));
        // Update only changed fields
        existing.setSiteName(updated.getSiteName());
        existing.setLogoUrl(updated.getLogoUrl());
        existing.setFaviconUrl(updated.getFaviconUrl());
        existing.setContactEmail(updated.getContactEmail());
        existing.setContactPhone(updated.getContactPhone());
        existing.setAddress(updated.getAddress());
        existing.setFacebookUrl(updated.getFacebookUrl());
        existing.setInstagramUrl(updated.getInstagramUrl());
        existing.setLinkedInUrl(updated.getLinkedInUrl());
        existing.setTwitterUrl(updated.getTwitterUrl());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
