package dev.ongolebulls.repository;

import dev.ongolebulls.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByRmIdAndIsCompletedFalseOrderByDueDateAsc(Long rmId);

    List<Task> findByRmIdAndIsCompletedTrueOrderByCompletedAtDesc(Long rmId);

    List<Task> findByRmIdOrderByCreatedAtDesc(Long rmId);
}
