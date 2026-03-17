


package dev.ongolebulls.service;

import dev.ongolebulls.dto.SectionItemDTO;
import dev.ongolebulls.dto.ServiceSectionRequestDTO;
import dev.ongolebulls.model.SectionItem;
import dev.ongolebulls.model.Service;
import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.repository.ServiceRepository;
import dev.ongolebulls.repository.ServiceSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
//import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Service
public class ServiceSectionService {

    @Autowired
    private ServiceSectionRepository repo;

    @Autowired
    private ServiceRepository serviceRepo;

    /* =========================
       READ OPERATIONS (KEEP)
    ========================== */

    public List<ServiceSection> getAll() {
        return repo.findAll();
    }

    public ServiceSection getById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ServiceSection> getByService(String serviceId) {
        return repo.findByServiceIdWithItems(serviceId);
    }

    /* =========================
       CREATE (DTO BASED)
    ========================== */
    @Transactional
    public ServiceSection create(String serviceId, ServiceSectionRequestDTO dto) {

        Service service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        ServiceSection section = new ServiceSection();
        section.setId(UUID.randomUUID().toString());
        section.setService(service);
       // System.out.println(ServiceSection.SectionType.valueOf(dto.getSectionType()));
        section.setSectionType(ServiceSection.SectionType.valueOf(dto.getSectionType()));
        section.setTitle(dto.getTitle());
        section.setSubtitle(dto.getSubtitle());
        section.setOrderIndex(resolveCreateOrder(serviceId, dto.getOrderIndex()));
        section.setMetaTitle(dto.getMetaTitle());
        section.setMetaKeywords(dto.getMetaKeywords());
        section.setMetaDescription(dto.getMetaDescription());
        section.setBannerImage(dto.getBannerImageUrl());

        Timestamp now = new Timestamp(System.currentTimeMillis());
        section.setCreatedAt(now);
        section.setUpdatedAt(now);

        // HERO
        if (section.getSectionType() == ServiceSection.SectionType.hero) {
            SectionItem heroItem = new SectionItem();
            heroItem.setId(UUID.randomUUID().toString());
            heroItem.setTitle(dto.getTitle());
            heroItem.setDescription(dto.getSubtitle());
            heroItem.setSection(section);
            section.getItems().add(heroItem);
        }

        // ALL OTHER TYPES (features, steps, faq, why_choose_us, future types)
        if (dto.getItems() != null) {
            for (SectionItemDTO itemDTO : dto.getItems()) {
                SectionItem item = new SectionItem();
                item.setId(UUID.randomUUID().toString());
                item.setTitle(itemDTO.getTitle());
                item.setDescription(itemDTO.getDescription());
                item.setOrderIndex(normalizeItemOrder(section, itemDTO.getOrderIndex()));
                item.setSection(section);
                section.getItems().add(item);
            }
        }

        return repo.save(section);
    }


    /* =========================
       UPDATE (DTO BASED)
    ========================== */
    @Transactional
    public ServiceSection update(String sectionId, ServiceSectionRequestDTO dto) {

        ServiceSection section = repo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        if (dto.getSectionType() != null && !dto.getSectionType().isBlank()) {
            section.setSectionType(ServiceSection.SectionType.valueOf(dto.getSectionType()));
        }
        section.setTitle(dto.getTitle());
        section.setSubtitle(dto.getSubtitle());
        section.setOrderIndex(resolveUpdateOrder(section, dto.getOrderIndex()));
        section.setMetaTitle(dto.getMetaTitle());
        section.setMetaKeywords(dto.getMetaKeywords());
        section.setMetaDescription(dto.getMetaDescription());
        section.setBannerImage(dto.getBannerImageUrl());
        section.setUpdatedAt(new Timestamp(System.currentTimeMillis()));


        return repo.save(section);
    }

    /* =========================
       DELETE
    ========================== */
    public void delete(String id) {
        repo.deleteById(id);
    }

    private Integer resolveCreateOrder(String serviceId, Integer requestedOrder) {
        List<ServiceSection> current = repo.findByServiceIdOrderByOrderIndexAsc(serviceId);
        int target = normalizeRequestedOrder(requestedOrder, current.size() + 1);

        for (int i = 0; i < current.size(); i++) {
            int normalized = i + 1;
            if (normalized >= target) normalized += 1;
            current.get(i).setOrderIndex(normalized);
        }
        if (!current.isEmpty()) {
            repo.saveAll(current);
        }
        return target;
    }

    private Integer resolveUpdateOrder(ServiceSection currentSection, Integer requestedOrder) {
        String serviceId = currentSection.getService().getId();
        List<ServiceSection> ordered = repo.findByServiceIdOrderByOrderIndexAsc(serviceId);

        ordered.removeIf(section -> section.getId().equals(currentSection.getId()));
        int currentOrder = currentSection.getOrderIndex() != null && currentSection.getOrderIndex() > 0
                ? currentSection.getOrderIndex()
                : ordered.size() + 1;
        int target = normalizeRequestedOrder(requestedOrder != null ? requestedOrder : currentOrder, ordered.size() + 1);

        ordered.add(target - 1, currentSection);
        for (int i = 0; i < ordered.size(); i++) {
            ordered.get(i).setOrderIndex(i + 1);
        }
        repo.saveAll(ordered);
        return target;
    }

    private int normalizeRequestedOrder(Integer requestedOrder, int maxAllowed) {
        if (requestedOrder == null || requestedOrder <= 0) return maxAllowed;
        return Math.max(1, Math.min(requestedOrder, maxAllowed));
    }

    private Integer normalizeItemOrder(ServiceSection section, Integer requestedOrder) {
        if (requestedOrder != null && requestedOrder > 0) return requestedOrder;
        int max = section.getItems().stream()
                .map(SectionItem::getOrderIndex)
                .filter(order -> order != null && order > 0)
                .max(Integer::compareTo)
                .orElse(0);
        return max + 1;
    }
}
