package dev.ongolebulls.dto.admin;

import lombok.Data;

import java.util.List;

@Data
public class UserPermissionRequest {
    private List<PermissionEntry> permissions;

    @Data
    public static class PermissionEntry {
        private String dashboard;
        private String section;
        private boolean canView;
        private boolean canCreate;
        private boolean canEdit;
        private boolean canDelete;
        private boolean canApprove;
    }
}
