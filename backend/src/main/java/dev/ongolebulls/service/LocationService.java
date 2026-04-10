package dev.ongolebulls.service;

import dev.ongolebulls.repository.LocationMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Read + validation API over the location_master table.
 * Used by both LocationController (dropdown data) and registration/admin
 * flows (validation of submitted state/district pairs).
 */
@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationMasterRepository locationRepository;

    public List<String> getAllStates() {
        return locationRepository.findDistinctStates();
    }

    public List<String> getDistrictsByState(String state) {
        if (state == null || state.isBlank()) return List.of();
        return locationRepository.findDistrictsByState(state.trim());
    }

    /**
     * True if the given state is present in the master table (case-insensitive).
     */
    public boolean isValidState(String state) {
        if (state == null || state.isBlank()) return false;
        return locationRepository.existsByStateIgnoreCase(state.trim());
    }

    /**
     * True if the (state, district) pair is a real row in the master table
     * (case-insensitive on both sides).
     */
    public boolean isValidStateAndDistrict(String state, String district) {
        if (state == null || state.isBlank() || district == null || district.isBlank()) return false;
        return locationRepository.existsByStateIgnoreCaseAndDistrictIgnoreCase(state.trim(), district.trim());
    }

    public long totalRows() {
        return locationRepository.count();
    }
}
