
package dev.ongolebulls.service;

import dev.ongolebulls.model.Service;
import dev.ongolebulls.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;


import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository repo;

    // Get all services
    public List<Service> getAll() {
        return repo.findAll();
    }

    // Get service by ID
    public Service getById(String id) {
        return repo.findById(id).orElse(null);
    }

    // Get service by Slug
    public Service getBySlug(String slug) {
        return repo.findBySlug(slug).orElse(null);
    }


    // create service
    public Service create(Service s) {
        s.setId(UUID.randomUUID().toString());
        Timestamp now = new Timestamp(System.currentTimeMillis());
        s.setCreatedAt(now);
        s.setUpdatedAt(now);

        // optional safety (not mandatory)
        if (s.getAllowedSectionTypes() == null) {
            s.setAllowedSectionTypes(List.of());
        }

        return repo.save(s);
    }

    //update with allowed section types
    public Service update(String id, Service s) {
        Service existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setSlug(s.getSlug());
        existing.setTitle(s.getTitle());
        existing.setSubtitle(s.getSubtitle());
        existing.setBannerImage(s.getBannerImage());
        existing.setMetaTitle(s.getMetaTitle());
        existing.setMetaDescription(s.getMetaDescription());
        existing.setMetaKeywords(s.getMetaKeywords());
        existing.setActive(s.isActive());

        existing.setAllowedSectionTypes(s.getAllowedSectionTypes());

        existing.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(existing);
    }


    // Delete service (cascade deletes sections & items)
    public void delete(String id) {
        repo.deleteById(id);
    }
}
