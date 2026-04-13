package dev.ongolebulls.service.partner;

import dev.ongolebulls.dto.partner.RevenueResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * STUB service so PartnerService + the partner/RevenueController can
 * compile. All methods return empty/zero values. Replace with real logic
 * when the revenue-domain layer is reintroduced.
 */
@Service
public class RevenueService {

    // --- Used by PartnerService.getStats ---
    public BigDecimal getTotalRevenue(Long partnerId) {
        return BigDecimal.ZERO;
    }

    // --- Used by controller/partner/RevenueController ---
    public RevenueResponse getRevenue(Long partnerId) {
        return RevenueResponse.builder()
                .totalRevenue(BigDecimal.ZERO)
                .releasedRevenue(BigDecimal.ZERO)
                .pendingRevenue(BigDecimal.ZERO)
                .monthlyBreakdown(List.of())
                .build();
    }
}
