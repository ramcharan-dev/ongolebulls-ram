package dev.ongolebulls.service;

import aj.org.objectweb.asm.commons.Remapper;
import dev.ongolebulls.model.SeoSetting;
import dev.ongolebulls.model.Service;

import dev.ongolebulls.repository.ServiceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository repo;

    public List<Service> getAll() {
        return repo.findAll();
    }

    public Optional<Service> getById(String id) {
        return repo.findById(id);
    }

    public Service create(Service s) {
        s.setId(UUID.randomUUID().toString());
        s.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        s.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(s);
    }

    public Service update(String id, Service s) {
        s.setId(id);
        s.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(s);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public Optional<Service> getBySlug(String slug) {
        return repo.findBySlug(slug);
    }



}

