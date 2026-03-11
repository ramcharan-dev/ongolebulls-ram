package dev.ongolebulls.util;

public class RiskCalculator {
    public static int calcScore(int[] answers) {
        int sum = 0;
        for (int a : answers) sum += a;
        return sum;
    }

    public static String label(int score) {
        if (score <= 7) return "CONSERVATIVE";
        if (score <= 10) return "MODERATE";
        return "AGGRESSIVE";
    }
}