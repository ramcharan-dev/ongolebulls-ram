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
 * (assignedState + assignedDistrict) matches the partner's location.
 *
 * Fallback chain:
 *   1. Exact match   — same state AND same district (district-level RM)
 *   2. State-only    — same state AND no district set (state-level RM)
 *   3. Any in state  — any activated RM in that state
 *   4. No RM found   — partner is saved with assignedRmId = null; admin can
 *                      assign manually later via the admin override endpoint.
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
    public Optional<User> findRmForLocation(String state, String district) {
        if (state == null || state.isBlank()) {
            return Optional.empty();
        }

        // Tier 1 — exact (state + district)
        if (district != null && !district.isBlank()) {
            List<User> exact = userRepository.findRmsByServiceArea(
                    Role.RELATIONSHIP_MANAGER, state.trim(), district.trim());
            if (!exact.isEmpty()) {
                log.debug("RM auto-assign: exact match found for {}/{} — rmId={}",
                        state, district, exact.get(0).getId());
                return Optional.of(exact.get(0));
            }
        }

        // Tier 2 — state-level RM (no district set)
        List<User> stateLevel = userRepository.findStateOnlyRms(
                Role.RELATIONSHIP_MANAGER, state.trim());
        if (!stateLevel.isEmpty()) {
            log.debug("RM auto-assign: state-level fallback for {}/{} — rmId={}",
                    state, district, stateLevel.get(0).getId());
            return Optional.of(stateLevel.get(0));
        }

        // Tier 3 — any RM in the state
        List<User> anyInState = userRepository.findAnyRmInState(
                Role.RELATIONSHIP_MANAGER, state.trim());
        if (!anyInState.isEmpty()) {
            log.debug("RM auto-assign: any-in-state fallback for {}/{} — rmId={}",
                    state, district, anyInState.get(0).getId());
            return Optional.of(anyInState.get(0));
        }

        log.info("RM auto-assign: no RM found for {}/{} — partner will be unassigned", state, district);
        return Optional.empty();
    }

    /**
     * Runs the location-based lookup and sets partner.assignedRmId.
     * Does NOT save — the caller owns the persistence.
     * Returns the assigned RM id (or null if none found).
     */
    public Long autoAssignRm(User partner) {
        Optional<User> rm = findRmForLocation(partner.getState(), partner.getDistrict());
        if (rm.isPresent()) {
            partner.setAssignedRmId(rm.get().getId());
            return rm.get().getId();
        }
        partner.setAssignedRmId(null);
        return null;
    }
}
