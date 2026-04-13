package dev.ongolebulls.service.partner;

import dev.ongolebulls.dto.partner.AddClientRequest;
import dev.ongolebulls.dto.partner.ClientSummaryResponse;
import dev.ongolebulls.model.LifecycleStage;
import dev.ongolebulls.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * STUB service so PartnerService + the partner/ClientController can compile.
 * All methods return empty/zero values. Replace with real implementations when
 * the client-domain logic is reintroduced; the location-based RM mapping work
 * does not depend on any of this.
 *
 * Bean is explicitly named "partnerClientService" to avoid the name collision
 * with the pre-existing {@code dev.ongolebulls.service.ClientService}, which
 * also defaults to bean name "clientService". Autowiring by type still works
 * because the two classes live in different packages.
 */
@Service("partnerClientService")
public class ClientService {

    // --- Used by PartnerService.getStats ---
    public long countByPartner(Long partnerId) {
        return 0L;
    }

    public long countByPartnerAndStage(Long partnerId, LifecycleStage stage) {
        return 0L;
    }

    public long countByPartnerAndStages(Long partnerId, List<LifecycleStage> stages) {
        return 0L;
    }

    // --- Used by controller/partner/ClientController ---
    public ClientSummaryResponse addClient(User partner, AddClientRequest request) {
        return ClientSummaryResponse.builder()
                .id(0L)
                .fullName(request != null ? request.getFullName() : null)
                .email(request != null ? request.getEmail() : null)
                .mobileNumber(request != null ? request.getMobile() : null)
                .lifecycleStage(LifecycleStage.LEAD_CREATED.name())
                .kycStatus("PENDING")
                .createdAt(java.time.Instant.now())
                .build();
    }

    public List<ClientSummaryResponse> getClients(Long partnerId, String stage, String search) {
        return List.of();
    }

    public ClientSummaryResponse updateClientLifecycle(User partner, Long clientId, String stage) {
        return ClientSummaryResponse.builder()
                .id(clientId)
                .lifecycleStage(stage)
                .build();
    }
}
