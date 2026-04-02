package dev.ongolebulls.repository;

import dev.ongolebulls.model.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {
    List<UserPermission> findByUserId(Long userId);
    List<UserPermission> findByUserIdAndDashboard(Long userId, String dashboard);
    @Transactional
    void deleteByUserId(Long userId);
}
