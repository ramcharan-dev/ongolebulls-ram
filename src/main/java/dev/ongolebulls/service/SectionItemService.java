package dev.ongolebulls.service;

import dev.ongolebulls.model.SectionItem;
import dev.ongolebulls.repository.SectionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SectionItemService {

    @Autowired
    private SectionItemRepository repo;

    public List<SectionItem> getBySection(String sectionId) {
        return repo.findBySectionIdOrderByOrderIndexAsc(sectionId);
    }

    public SectionItem create(SectionItem s) {
        s.setId(UUID.randomUUID().toString());
        return repo.save(s);
    }

    public SectionItem update(String id, SectionItem s) {
        SectionItem existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        // Update only fields that should be editable
        existing.setIcon(s.getIcon());
        existing.setTitle(s.getTitle());
        existing.setDescription(s.getDescription());
        existing.setOrderIndex(s.getOrderIndex());
        existing.setSectionId(s.getSectionId());

        return repo.save(existing);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
