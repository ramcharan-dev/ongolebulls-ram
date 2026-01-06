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

    public List<ServiceSection> getByService(String serviceId) {
        return repo.findByServiceIdOrderByOrderIndexAsc(serviceId);
    }

    public ServiceSection getById(String id) {
        return repo.findById(id).orElse(null);
    }

    public ServiceSection create(ServiceSection s) {
        s.setId(UUID.randomUUID().toString());
        s.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        s.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(s);
    }

    public ServiceSection update(String id, ServiceSection s) {
        ServiceSection existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        s.setId(id);
        s.setCreatedAt(existing.getCreatedAt());
        s.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(s);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}

