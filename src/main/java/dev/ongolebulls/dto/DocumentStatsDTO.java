package dev.ongolebulls.dto;

public class DocumentStatsDTO {

    private Long pending;
    private Long approved;
    private Long underReview;
    private Long total;

    public DocumentStatsDTO() {}

    public DocumentStatsDTO(Long pending, Long approved, Long underReview, Long total) {
        this.pending = pending;
        this.approved = approved;
        this.underReview = underReview;
        this.total = total;
    }

    // Getters and Setters
    public Long getPending() {
        return pending;
    }

    public void setPending(Long pending) {
        this.pending = pending;
    }

    public Long getApproved() {
        return approved;
    }

    public void setApproved(Long approved) {
        this.approved = approved;
    }

    public Long getUnderReview() {
        return underReview;
    }

    public void setUnderReview(Long underReview) {
        this.underReview = underReview;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
