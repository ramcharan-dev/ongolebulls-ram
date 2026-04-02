/*
package dev.ongolebulls.repository;

import dev.ongolebulls.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameOrMobile(String username, String mobile);
}
*/
package dev.ongolebulls.repository;

import dev.ongolebulls.model.LifecycleStage;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobileNumber(String mobileNumber); // ✅ match field name
    Optional<User> findByEmailOrMobileNumber(String email, String mobileNumber); // ✅ fixed

    List<User> findByRoleNotIn(Collection<Role> roles);

    List<User> findByRoleIn(Collection<Role> roles);

    List<User> findByRole(Role role);

    long countByRole(Role role);

    long countByRoleIn(Collection<Role> roles);

    long countByRoleInAndIsActivated(Collection<Role> roles, Boolean isActivated);

    List<User> findTop5ByRoleInOrderByCreatedAtDesc(Collection<Role> roles);

    List<User> findTop5ByRoleNotInOrderByCreatedAtDesc(Collection<Role> roles);

    // --- Partner client queries ---
    List<User> findByAssignedPartnerIdOrderByCreatedAtDesc(Long partnerId);

    long countByAssignedPartnerId(Long partnerId);

    long countByAssignedPartnerIdAndLifecycleStage(Long partnerId, LifecycleStage stage);

    long countByAssignedPartnerIdAndLifecycleStageIn(Long partnerId, List<LifecycleStage> stages);

    @Query("SELECT u FROM User u WHERE u.assignedPartnerId = :partnerId " +
            "AND (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%',:search,'%')))")
    List<User> searchClientsByPartner(@Param("partnerId") Long partnerId, @Param("search") String search);

    // --- RM queries ---
    List<User> findByAssignedRmIdAndRoleIn(Long rmId, Collection<Role> roles);

    long countByAssignedRmIdAndRoleIn(Long rmId, Collection<Role> roles);

    long countByAssignedRmIdAndRoleInAndIsActivated(Long rmId, Collection<Role> roles, Boolean isActivated);

    List<User> findTop5ByAssignedRmIdAndRoleInAndIsActivatedOrderByCreatedAtAsc(Long rmId, Collection<Role> roles, Boolean isActivated);

    List<User> findTop5ByAssignedRmIdAndRoleInOrderByCreatedAtDesc(Long rmId, Collection<Role> roles);

    @Query("SELECT u FROM User u WHERE u.assignedRmId = :rmId AND u.role IN :roles " +
            "AND (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%',:search,'%')) " +
            "OR LOWER(u.arn) LIKE LOWER(CONCAT('%',:search,'%')))")
    List<User> searchPartnersByRm(@Param("rmId") Long rmId, @Param("roles") Collection<Role> roles, @Param("search") String search);

    // --- Operations queries ---
    List<User> findByRoleInAndIsActivatedOrderByCreatedAtAsc(Collection<Role> roles, Boolean isActivated);

    List<User> findTop5ByRoleInAndIsActivatedOrderByCreatedAtAsc(Collection<Role> roles, Boolean isActivated);

    @Query("SELECT u FROM User u WHERE u.role IN :roles " +
            "AND (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%',:search,'%')) " +
            "OR LOWER(u.arn) LIKE LOWER(CONCAT('%',:search,'%')))")
    List<User> searchPartners(@Param("roles") Collection<Role> roles, @Param("search") String search);

    // Clients by lifecycle stage
    List<User> findByLifecycleStageInOrderByCreatedAtAsc(Collection<LifecycleStage> stages);

    List<User> findByLifecycleStageOrderByCreatedAtAsc(LifecycleStage stage);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role IN :roles AND u.isActivated = true " +
            "AND u.createdAt >= :since")
    long countActivatedSince(@Param("roles") Collection<Role> roles, @Param("since") java.time.Instant since);
}
