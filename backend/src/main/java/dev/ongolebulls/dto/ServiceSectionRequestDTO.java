package dev.ongolebulls.dto;

import dev.ongolebulls.model.ServiceSection;
import dev.ongolebulls.model.ServiceSection.SectionType;
import java.util.List;

public class ServiceSectionRequestDTO {

    private String sectionType;

    // Common fields (ALL section types)
    private String title;
    private String subtitle;
    private Integer orderIndex;

    // SEO
    private String metaTitle;
    private String metaKeywords;
    private String metaDescription;

    // Hero only
    private String bannerImageUrl;

    // CTA only
    private String buttonText;
    private String buttonUrl;

    // Items (Features / Steps / FAQ / Why choose us / future)
    private List<SectionItemDTO> items;

    // ===== Getters & Setters =====

    public String getSectionType() {
        return sectionType;
    }

    public void setSectionType(String sectionType) {
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

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public String getButtonText() {
        return buttonText;
    }

    public void setButtonText(String buttonText) {
        this.buttonText = buttonText;
    }

    public String getButtonUrl() {
        return buttonUrl;
    }

    public void setButtonUrl(String buttonUrl) {
        this.buttonUrl = buttonUrl;
    }

    public List<SectionItemDTO> getItems() {
        return items;
    }

    public void setItems(List<SectionItemDTO> items) {
        this.items = items;
    }
}
