package dev.ongolebulls.service.partner;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * STUB: minimal compile-satisfying implementation so the existing
 * {@link PartnerService} can reference this bean. A real transaction-domain
 * service must replace this before production.
 *
 * Added by the location-based RM mapping work to unblock the build.
 */
@Service
public class TransactionService {

    public long countByPartner(Long partnerId) {
        return 0L;
    }

    public BigDecimal sumActiveAmount(Long partnerId) {
        return BigDecimal.ZERO;
    }
}
