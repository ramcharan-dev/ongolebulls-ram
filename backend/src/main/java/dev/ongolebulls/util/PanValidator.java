package dev.ongolebulls.util;

public class PanValidator {
    public static boolean isValidPan(String pan) {
        if (pan == null) return false;
        return pan.matches("^[A-Z]{5}[0-9]{4}[A-Z]$");
    }
}
