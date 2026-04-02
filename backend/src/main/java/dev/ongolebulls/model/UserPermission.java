package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_permissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "dashboard", "section"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String dashboard;

    @Column(nullable = false)
    private String section;

    @Column(name = "can_view")
    private Boolean canView = true;

    @Column(name = "can_create")
    private Boolean canCreate = true;

    @Column(name = "can_edit")
    private Boolean canEdit = true;

    @Column(name = "can_delete")
    private Boolean canDelete = false;

    @Column(name = "can_approve")
    private Boolean canApprove = false;

    @Column(name = "updated_by")
    private Long updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
