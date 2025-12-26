package dev.ongolebulls.service;

import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.repository.ServiceSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class ServiceSectionService {

    @Autowired
    private ServiceSectionRepository repo;

    // =====================================================
    // GET SECTIONS BY SERVICE ID
    // =====================================================
    public List<ServiceSection> getByService(String serviceId) {
        return repo.findByServiceIdOrderByOrderIndexAsc(serviceId);
    }

    // =====================================================
    // GET SECTION BY ID
    // =====================================================
    public ServiceSection getById(String id) {
        return repo.findById(id).orElse(null);
    }

    // =====================================================
    // CREATE SECTION
    // =====================================================
    public ServiceSection create(ServiceSection s) {
        s.setId(UUID.randomUUID().toString());
        s.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        s.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(s);
    }

    // =====================================================
    // UPDATE SECTION
    // =====================================================
    public ServiceSection update(String id, ServiceSection s) {
        ServiceSection existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        s.setId(id);
        s.setCreatedAt(existing.getCreatedAt());
        s.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(s);
    }

    // =====================================================
    // DELETE SECTION
    // =====================================================
    public void delete(String id) {
        repo.deleteById(id);
    }

    // =====================================================
    // GET ALL SECTIONS (❗ REQUIRED for /api/sections)
    // =====================================================
    public List<ServiceSection> getAll() {
        return repo.findAll();
    }
}
