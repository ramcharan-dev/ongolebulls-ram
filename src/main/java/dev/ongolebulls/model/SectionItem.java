package dev.ongolebulls.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "section_items")
public class SectionItem {

    @Id
    @Column(length = 36, nullable = false, unique = true)
    private String id = UUID.randomUUID().toString();

    @Column(name = "section_id", length = 36, nullable = false)
    private String sectionId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String icon;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String subtitle;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;

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

    // ======== Getters & Setters =========

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

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
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
}