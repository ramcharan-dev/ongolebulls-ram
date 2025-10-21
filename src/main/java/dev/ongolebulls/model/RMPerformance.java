package dev.ongolebulls.model;

public class RMPerformance {
    private String name;
    private long aum;

    public RMPerformance(String name, long aum) {
        this.name = name;
        this.aum = aum;
    }

    public String getName() { return name; }
    public long getAum() { return aum; }

    public void setName(String name) { this.name = name; }
    public void setAum(long aum) { this.aum = aum; }
}
