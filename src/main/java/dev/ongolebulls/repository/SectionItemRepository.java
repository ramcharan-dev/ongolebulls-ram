package dev.ongolebulls.repository;

import dev.ongolebulls.model.SectionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionItemRepository extends JpaRepository<SectionItem, String> {
    List<SectionItem> findBySectionIdOrderByOrderIndexAsc(String sectionId);
}
