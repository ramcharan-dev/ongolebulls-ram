package dev.ongolebulls.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleUsersResponse {
    private String role;
    private String displayName;
    private long userCount;
    private List<UserEntry> users;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserEntry {
        private Long id;
        private String name;
        private String email;
        private boolean isActivated;
    }
}
