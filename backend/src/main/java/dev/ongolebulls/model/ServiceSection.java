

package dev.ongolebulls.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "service_sections")
public class ServiceSection {

    @Id
    @Column(length = 36, nullable = false, unique = true)
    private String id = UUID.randomUUID().toString();

    // ---------------- Relation to Service ----------------
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    @JsonBackReference("service-sections")
    private Service service;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false)
    private SectionType sectionType;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String subtitle;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Lob
    @Column(name = "meta_title", columnDefinition = "LONGTEXT")
    private String metaTitle;

    @Lob
    @Column(name = "meta_keywords", columnDefinition = "LONGTEXT")
    private String metaKeywords;

    @Lob
    @Column(name = "meta_description", columnDefinition = "LONGTEXT")
    private String metaDescription;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    // ---------------- Relation to SectionItem ----------------
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference("section-items")
    private List<SectionItem> items = new ArrayList<>();

    //if section type is hero, then we need banner image
    @Lob
    @Column(name = "banner_image", columnDefinition = "LONGTEXT")
    private String bannerImage;


    // ===== Enum SectionType =====
    public enum SectionType {
        hero, features, steps, why_choose_us, faq, cta
    }

    // ===== Getters & Setters =====

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public SectionType getSectionType() {
        return sectionType;
    }

    public void setSectionType(SectionType sectionType) {
        this.sectionType = sectionType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getMetaTitle() {
        return metaTitle;
    }

    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }

    public String getMetaKeywords() {
        return metaKeywords;
    }

    public void setMetaKeywords(String metaKeywords) {
        this.metaKeywords = metaKeywords;
    }

    public String getMetaDescription() {
        return metaDescription;
    }

    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<SectionItem> getItems() {
        return items;
    }

    public void setItems(List<SectionItem> items) {
        this.items = items;
    }

    public String getBannerImage() {
        return bannerImage;
    }

    public void setBannerImage(String bannerImage) {
        this.bannerImage = bannerImage;
    }
}
