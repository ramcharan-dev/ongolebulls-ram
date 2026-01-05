package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private Long cartId;
    private Long userId;
    private List<CartItemDto> items;
    private BigDecimal totalAmount;
    private Integer totalItems;
    private LocalDateTime lastUpdated;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        private Long itemId;
        private Long fundId;
        private String fundName;
        private String amcName;
        private Long planId;
        private String planType; // REGULAR or DIRECT
        private String optionType; // GROWTH or DIVIDEND
        private String investmentType; // LUMPSUM or SIP
        private BigDecimal amount;
        private BigDecimal sipAmount;
        private Integer sipDuration;
        private BigDecimal nav;
        private LocalDateTime addedAt;
    }
}

