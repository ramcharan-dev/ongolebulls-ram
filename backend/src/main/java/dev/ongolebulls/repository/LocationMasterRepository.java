package dev.ongolebulls.repository;

import dev.ongolebulls.model.LocationMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LocationMasterRepository extends JpaRepository<LocationMaster, Long> {

    /**
     * Returns sorted distinct state names for the States dropdown.
     */
    @Query("SELECT DISTINCT l.state FROM LocationMaster l ORDER BY l.state ASC")
    List<String> findDistinctStates();

    /**
     * Returns sorted district names for the given state (dependent dropdown).
     */
    @Query("SELECT l.district FROM LocationMaster l WHERE l.state = :state ORDER BY l.district ASC")
    List<String> findDistrictsByState(String state);

    boolean existsByStateIgnoreCase(String state);

    boolean existsByStateIgnoreCaseAndDistrictIgnoreCase(String state, String district);

    long countByState(String state);
}
