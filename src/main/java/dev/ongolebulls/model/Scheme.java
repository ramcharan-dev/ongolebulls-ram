package dev.ongolebulls.model;

import jakarta.persistence.*;

@Entity
public class Scheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double avgReturnRate;

    @ManyToOne
    @JoinColumn(name = "amc_id")
    private AMC amc;

    public Scheme() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public double getAvgReturnRate() { return avgReturnRate; }
    public AMC getAmc() { return amc; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAvgReturnRate(double avgReturnRate) { this.avgReturnRate = avgReturnRate; }
    public void setAmc(AMC amc) { this.amc = amc; }
}
