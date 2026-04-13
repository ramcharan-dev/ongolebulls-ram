package dev.ongolebulls.service;

import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Location-based RM auto-assignment.
 *
 * Called during partner registration to pick an RM whose service area
 * (assignedState + assignedDistrict + assignedCity) matches the partner's
 * location.
 *
 * Fallback chain (most specific → least specific):
 *   0. City-level    — same state AND same city (case-insensitive)        [NEW]
 *   1. District-level — same state AND same district (RM has no city)
 *   2. State-level    — same state AND RM has no district and no city
 *   3. Any in state   — any activated RM in that state
 *   4. No RM found    — partner is saved with assignedRmId = null; admin can
 *                       assign manually later via the admin override endpoint.
 *
 * City matching is case-insensitive and trimmed, so "Vishakapatnam" matches
 * "vishakapatnam" and "  Visakhapatnam " matches "Visakhapatnam".
 *
 * When multiple RMs tie at a given tier, the lowest id wins (deterministic
 * "round-robin by seniority").
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RmAssignmentService {

    private final UserRepository userRepository;

    /**
     * Finds the best-matching RM for a partner's location. Returns empty if
     * no activated RM covers the state at all.
     */
    public Optional<User> findRmForLocation(String state, String district, String city) {
        if (state == null || state.isBlank()) {
            return Optional.empty();
        }

        // Tier 0 — city-level RM (most specific: state + city, case-insensitive)
        if (city != null && !city.isBlank()) {
            List<User> cityMatch = userRepository.findRmsByServiceAreaCity(
                    Role.RELATIONSHIP_MANAGER, state.trim(), city.trim());
            if (!cityMatch.isEmpty()) {
                log.debug("RM auto-assign: city match found for {}/{}/{} — rmId={}",
                        state, district, city, cityMatch.get(0).getId());
                return Optional.of(cityMatch.get(0));
            }
        }

        // Tier 1 — district-level RM (state + district, no city pinned)
        if (district != null && !district.isBlank()) {
            List<User> districtMatch = userRepository.findRmsByServiceArea(
                    Role.RELATIONSHIP_MANAGER, state.trim(), district.trim());
            if (!districtMatch.isEmpty()) {
                log.debug("RM auto-assign: district match for {}/{}/{} — rmId={}",
                        state, district, city, districtMatch.get(0).getId());
                return Optional.of(districtMatch.get(0));
            }
        }

        // Tier 2 — state-level RM (no district, no city)
        List<User> stateLevel = userRepository.findStateOnlyRms(
                Role.RELATIONSHIP_MANAGER, state.trim());
        if (!stateLevel.isEmpty()) {
            log.debug("RM auto-assign: state-level fallback for {}/{}/{} — rmId={}",
                    state, district, city, stateLevel.get(0).getId());
            return Optional.of(stateLevel.get(0));
        }

        // Tier 3 — any RM in the state
        List<User> anyInState = userRepository.findAnyRmInState(
                Role.RELATIONSHIP_MANAGER, state.trim());
        if (!anyInState.isEmpty()) {
            log.debug("RM auto-assign: any-in-state fallback for {}/{}/{} — rmId={}",
                    state, district, city, anyInState.get(0).getId());
            return Optional.of(anyInState.get(0));
        }

        log.info("RM auto-assign: no RM found for {}/{}/{} — partner will be unassigned",
                state, district, city);
        return Optional.empty();
    }

    /**
     * Runs the location-based lookup and sets partner.assignedRmId.
     * Does NOT save — the caller owns the persistence.
     * Returns the assigned RM id (or null if none found).
     */
    public Long autoAssignRm(User partner) {
        Optional<User> rm = findRmForLocation(
                partner.getState(),
                partner.getDistrict(),
                partner.getCity());
        if (rm.isPresent()) {
            partner.setAssignedRmId(rm.get().getId());
            return rm.get().getId();
        }
        partner.setAssignedRmId(null);
        return null;
    }
}
