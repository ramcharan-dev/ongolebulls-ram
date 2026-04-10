package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Master list of India states and districts used for:
 *   - Partner registration location input (state + district dropdowns)
 *   - RM service-area assignment (assignedState + assignedDistrict)
 *   - Location-based RM auto-assignment
 *
 * Seeded from classpath:/locations/india_locations.csv by LocationSeeder.
 */
@Entity
@Table(
        name = "location_master",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_location_state_district", columnNames = {"state", "district"})
        },
        indexes = {
                @Index(name = "idx_location_state", columnList = "state"),
                @Index(name = "idx_location_state_district", columnList = "state, district")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String district;
}
