package dev.ongolebulls.dto.compliance;

import lombok.*;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisclosureResponse {
    private Long id;
    private String fullName;
    private String email;
    private String partnerType;
    private boolean termsAccepted;
    private boolean declarationAccepted;
    private boolean consentComm;
    private boolean consentShareAmc;
    private boolean consentShareDocs;
    private Instant createdAt;
}
