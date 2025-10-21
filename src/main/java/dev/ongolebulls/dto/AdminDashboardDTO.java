package dev.ongolebulls.dto;

import java.util.List;

public class AdminDashboardDTO {

    public static class ChartData {
        private List<String> labels;
        private List<Number> planned;  // optional, for SIP
        private List<Number> executed; // optional, for SIP
        private List<Number> values;   // for pie charts

        public ChartData(List<String> labels, List<Number> values) {
            this.labels = labels;
            this.values = values;
        }

        public ChartData(List<String> labels, List<Number> planned, List<Number> executed) {
            this.labels = labels;
            this.planned = planned;
            this.executed = executed;
        }

        public List<String> getLabels() { return labels; }
        public List<Number> getPlanned() { return planned; }
        public List<Number> getExecuted() { return executed; }
        public List<Number> getValues() { return values; }
    }
}
