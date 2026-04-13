package dev.ongolebulls.config;

import dev.ongolebulls.model.LocationMaster;
import dev.ongolebulls.repository.LocationMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Seeds the location_master table from classpath:/locations/india_locations.csv
 * on application startup.
 *
 * Idempotent: skips rows that already exist (matched on state + district, case-insensitive).
 * Runs on every boot so that CSV additions are picked up without manual migration.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class LocationSeeder {

    private static final String CSV_PATH = "locations/india_locations.csv";

    @Bean
    public ApplicationRunner seedLocations(LocationMasterRepository repo) {
        return args -> {
            try {
                List<LocationMaster> parsed = parseCsv();
                if (parsed.isEmpty()) {
                    log.warn("LocationSeeder: CSV {} is empty, no locations to seed", CSV_PATH);
                    return;
                }

                // Build a lower-cased set of existing (state|district) keys so we can skip duplicates.
                Set<String> existingKeys = new HashSet<>();
                for (LocationMaster existing : repo.findAll()) {
                    existingKeys.add(key(existing.getState(), existing.getDistrict()));
                }

                List<LocationMaster> toInsert = new ArrayList<>();
                for (LocationMaster row : parsed) {
                    if (!existingKeys.contains(key(row.getState(), row.getDistrict()))) {
                        toInsert.add(row);
                    }
                }

                if (toInsert.isEmpty()) {
                    log.info("LocationSeeder: no new rows to insert; {} locations already present", existingKeys.size());
                    return;
                }

                repo.saveAll(toInsert);
                log.info("LocationSeeder: inserted {} new locations (total now {})",
                        toInsert.size(), existingKeys.size() + toInsert.size());
            } catch (Exception ex) {
                log.error("LocationSeeder: failed to seed locations from {}: {}", CSV_PATH, ex.getMessage(), ex);
            }
        };
    }

    private List<LocationMaster> parseCsv() throws Exception {
        ClassPathResource resource = new ClassPathResource(CSV_PATH);
        if (!resource.exists()) {
            log.warn("LocationSeeder: CSV file not found at classpath:{}", CSV_PATH);
            return List.of();
        }

        List<LocationMaster> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isFirst = true;
            while ((line = reader.readLine()) != null) {
                if (isFirst) {
                    isFirst = false;
                    // Skip header line "state,district"
                    if (line.trim().toLowerCase().startsWith("state")) continue;
                }
                if (line.trim().isEmpty()) continue;

                int comma = line.indexOf(',');
                if (comma < 0) continue;

                String state = line.substring(0, comma).trim();
                String district = line.substring(comma + 1).trim();
                if (state.isEmpty() || district.isEmpty()) continue;

                rows.add(LocationMaster.builder()
                        .state(state)
                        .district(district)
                        .build());
            }
        }
        return rows;
    }

    private String key(String state, String district) {
        return (state == null ? "" : state.trim().toLowerCase())
                + "|"
                + (district == null ? "" : district.trim().toLowerCase());
    }
}
