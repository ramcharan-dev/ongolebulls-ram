

package dev.ongolebulls.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "services")
public class Service {

    @Id
    @Column(length = 36, nullable = false, unique = true)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false, unique = true)
    private String slug;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String subtitle;

    @Lob
    @Column(name = "banner_image", columnDefinition = "LONGTEXT")
    private String bannerImage;

    @Lob
    @Column(name = "meta_title", columnDefinition = "LONGTEXT")
    private String metaTitle;

    @Lob
    @Column(name = "meta_description", columnDefinition = "LONGTEXT")
    private String metaDescription;

    @Lob
    @Column(name = "meta_keywords", columnDefinition = "LONGTEXT")
    private String metaKeywords;

    @Column(name = "is_active")
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    // ---------------- Hierarchy ----------------
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("service-sections")
    private List<ServiceSection> sections = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "service_allowed_section_types",
            joinColumns = @JoinColumn(name = "service_id")
    )
    @Column(name = "section_type")
    private List<String> allowedSectionTypes = new ArrayList<>();


    // ===== Getters & Setters =====

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
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

    public String getBannerImage() {
        return bannerImage;
    }

    public void setBannerImage(String bannerImage) {
        this.bannerImage = bannerImage;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    public List<ServiceSection> getSections() {
        return sections;
    }

    public void setSections(List<ServiceSection> sections) {
        this.sections = sections;
    }

    public List<String> getAllowedSectionTypes() {
        return allowedSectionTypes;
    }

    public void setAllowedSectionTypes(List<String> allowedSectionTypes) {
        this.allowedSectionTypes = allowedSectionTypes;
    }

}

