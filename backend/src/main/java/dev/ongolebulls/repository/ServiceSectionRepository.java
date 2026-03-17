package dev.ongolebulls.repository;

import dev.ongolebulls.model.ServiceSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceSectionRepository extends JpaRepository<ServiceSection, String> {

    @Query("SELECT DISTINCT s FROM ServiceSection s LEFT JOIN FETCH s.items WHERE s.service.id = :serviceId ORDER BY s.orderIndex ASC")
    List<ServiceSection> findByServiceIdWithItems(@Param("serviceId") String serviceId);

    List<ServiceSection> findByServiceIdOrderByOrderIndexAsc(String serviceId);

    void deleteByServiceId(String serviceId);
}