package dev.ongolebulls.service.partner;

import dev.ongolebulls.model.LifecycleStage;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * STUB: minimal compile-satisfying implementation so the existing
 * {@link PartnerService} can reference this bean. A real client-domain
 * service (with partner-level counts) must replace this before production.
 *
 * This file was added by the location-based RM mapping work to unblock
 * the build; none of its methods are location-related. If you are looking
 * for the real client counting logic, reintroduce it here.
 */
@Service
public class ClientService {

    public long countByPartner(Long partnerId) {
        return 0L;
    }

    public long countByPartnerAndStage(Long partnerId, LifecycleStage stage) {
        return 0L;
    }

    public long countByPartnerAndStages(Long partnerId, List<LifecycleStage> stages) {
        return 0L;
    }
}
