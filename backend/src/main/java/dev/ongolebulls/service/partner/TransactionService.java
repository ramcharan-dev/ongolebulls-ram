package dev.ongolebulls.service.partner;

import dev.ongolebulls.dto.partner.TransactionRequest;
import dev.ongolebulls.dto.partner.TransactionResponse;
import dev.ongolebulls.model.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * STUB service so PartnerService + the partner/TransactionController can
 * compile. All methods return empty/zero values. Replace with real logic
 * when the transaction-domain layer is reintroduced.
 */
@Service
public class TransactionService {

    // --- Used by PartnerService.getStats ---
    public long countByPartner(Long partnerId) {
        return 0L;
    }

    public BigDecimal sumActiveAmount(Long partnerId) {
        return BigDecimal.ZERO;
    }

    // --- Used by controller/partner/TransactionController ---
    public TransactionResponse createTransaction(User partner, TransactionRequest request) {
        return TransactionResponse.builder()
                .id(0L)
                .clientId(request != null ? request.getClientId() : null)
                .type(request != null ? request.getType() : null)
                .schemeName(request != null ? request.getSchemeName() : null)
                .amount(request != null ? request.getAmount() : BigDecimal.ZERO)
                .notes(request != null ? request.getNotes() : null)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
    }

    public List<TransactionResponse> getTransactions(Long partnerId, String type, String status) {
        return List.of();
    }
}
