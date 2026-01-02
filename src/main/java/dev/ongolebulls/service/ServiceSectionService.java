


package dev.ongolebulls.service;

import dev.ongolebulls.dto.SectionItemDTO;
import dev.ongolebulls.dto.ServiceSectionRequestDTO;
import dev.ongolebulls.model.SectionItem;
import dev.ongolebulls.model.Service;
import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.repository.ServiceRepository;
import dev.ongolebulls.repository.ServiceSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<ServiceSection> getByService(String serviceId) {
        return repo.findByServiceIdOrderByOrderIndexAsc(serviceId);
    }

    /* =========================
       CREATE (DTO BASED)
    ========================== */
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
        section.setOrderIndex(dto.getOrderIndex());
        section.setMetaTitle(dto.getMetaTitle());
        section.setMetaKeywords(dto.getMetaKeywords());
        section.setMetaDescription(dto.getMetaDescription());

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
                item.setOrderIndex(itemDTO.getOrderIndex());
                item.setSection(section);
                section.getItems().add(item);
            }
        }

        return repo.save(section);
    }


    /* =========================
       UPDATE (DTO BASED)
    ========================== */
    public ServiceSection update(String sectionId, ServiceSectionRequestDTO dto) {

        ServiceSection section = repo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        section.setTitle(dto.getTitle());
        section.setSubtitle(dto.getSubtitle());
        section.setOrderIndex(dto.getOrderIndex());
        section.setMetaTitle(dto.getMetaTitle());
        section.setMetaKeywords(dto.getMetaKeywords());
        section.setMetaDescription(dto.getMetaDescription());
        section.setUpdatedAt(new Timestamp(System.currentTimeMillis()));


        return repo.save(section);
    }

    /* =========================
       DELETE
    ========================== */
    public void delete(String id) {
        repo.deleteById(id);
    }
}

