package dev.ongolebulls.repository;

import dev.ongolebulls.model.ServiceSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceSectionRepository extends JpaRepository<ServiceSection, String> {
    List<ServiceSection> findByServiceIdOrderByOrderIndexAsc(String serviceId);
}
