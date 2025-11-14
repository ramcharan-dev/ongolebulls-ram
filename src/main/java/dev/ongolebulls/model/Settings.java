package dev.ongolebulls.model;

import jakarta.persistence.*;

@Entity
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String siteName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String logoUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String faviconUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contactEmail;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contactPhone;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String address;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String facebookUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String instagramUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String linkedInUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String twitterUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String seoTitle;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String seoKeywords;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String seoDescription;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getFaviconUrl() {
        return faviconUrl;
    }

    public void setFaviconUrl(String faviconUrl) {
        this.faviconUrl = faviconUrl;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }

    public String getLinkedInUrl() {
        return linkedInUrl;
    }

    public void setLinkedInUrl(String linkedInUrl) {
        this.linkedInUrl = linkedInUrl;
    }

    public String getTwitterUrl() {
        return twitterUrl;
    }

    public void setTwitterUrl(String twitterUrl) {
        this.twitterUrl = twitterUrl;
    }

    public String getSeoTitle() {
        return seoTitle;
    }

    public void setSeoTitle(String seoTitle) {
        this.seoTitle = seoTitle;
    }

    public String getSeoKeywords() {
        return seoKeywords;
    }

    public void setSeoKeywords(String seoKeywords) {
        this.seoKeywords = seoKeywords;
    }

    public String getSeoDescription() {
        return seoDescription;
    }

    public void setSeoDescription(String seoDescription) {
        this.seoDescription = seoDescription;
    }
}
