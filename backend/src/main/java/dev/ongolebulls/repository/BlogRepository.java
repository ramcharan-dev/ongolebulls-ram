package dev.ongolebulls.repository;

import dev.ongolebulls.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    // No extra methods needed for basic CRUD
}
