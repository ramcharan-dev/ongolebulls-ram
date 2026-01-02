//package dev.ongolebulls.service;
//
//import dev.ongolebulls.model.SectionItem;
//import dev.ongolebulls.repository.SectionItemRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.UUID;
//
//@Service
//public class SectionItemService {
//
//    @Autowired
//    private SectionItemRepository repo;
//
//    public List<SectionItem> getBySection(String sectionId) {
//        return repo.findBySectionIdOrderByOrderIndexAsc(sectionId);
//    }
//
//    public SectionItem create(SectionItem s) {
//        s.setId(UUID.randomUUID().toString());
//        return repo.save(s);
//    }
//
//    public SectionItem update(String id, SectionItem s) {
//        SectionItem existing = repo.findById(id).orElse(null);
//        if (existing == null) return null;
//
//        // Update only fields that should be editable
//        existing.setIcon(s.getIcon());
//        existing.setTitle(s.getTitle());
//        existing.setDescription(s.getDescription());
//        existing.setOrderIndex(s.getOrderIndex());
//        existing.setSectionId(s.getSectionId());
//
//        return repo.save(existing);
//    }
//
//    public void delete(String id) {
//        repo.deleteById(id);
//    }
//}

package dev.ongolebulls.service;

import dev.ongolebulls.model.SectionItem;
import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.repository.SectionItemRepository;
import dev.ongolebulls.repository.ServiceSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.sql.Timestamp;

@Service
public class SectionItemService {

    @Autowired
    private SectionItemRepository repo;

    @Autowired
    private ServiceSectionRepository sectionRepo;

    // Get all items
    public List<SectionItem> getAll() {
        return repo.findAll();
    }

    // Get item by ID
    public SectionItem getById(String id) {
        return repo.findById(id).orElse(null);
    }

    // Get items by Section ID
    public List<SectionItem> getBySection(String sectionId) {
        return repo.findBySectionIdOrderByOrderIndexAsc(sectionId);
    }

    // Create item under a section
    public SectionItem create(String sectionId, SectionItem item) {
        ServiceSection parentSection = sectionRepo.findById(sectionId).orElse(null);
        if (parentSection == null) return null;

        item.setId(UUID.randomUUID().toString());
        item.setSection(parentSection);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        item.setCreatedAt(now);
        item.setUpdatedAt(now);

        return repo.save(item);
    }

    // Update item
    public SectionItem update(String id, SectionItem item) {
        SectionItem existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setIcon(item.getIcon());
        existing.setTitle(item.getTitle());
        existing.setSubtitle(item.getSubtitle());
        existing.setDescription(item.getDescription());
        existing.setOrderIndex(item.getOrderIndex());
        existing.setMetaTitle(item.getMetaTitle());
        existing.setMetaKeywords(item.getMetaKeywords());
        existing.setMetaDescription(item.getMetaDescription());
        existing.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        return repo.save(existing);
    }

    // Delete item
    public void delete(String id) {
        repo.deleteById(id);
    }
}
