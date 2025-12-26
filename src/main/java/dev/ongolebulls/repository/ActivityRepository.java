// ActivityRepository.java
package dev.ongolebulls.repository;

import dev.ongolebulls.model.Activity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);
}