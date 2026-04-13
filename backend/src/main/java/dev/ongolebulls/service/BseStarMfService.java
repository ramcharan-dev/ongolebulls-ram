package dev.ongolebulls.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @deprecated Replaced by the new BSE module architecture.
 * UCC creation is now handled by:
 * - {@link dev.ongolebulls.bse.ucc.client.BseUccClient}
 * - {@link dev.ongolebulls.bse.ucc.service.UccService}
 *
 * This class is retained temporarily for backward compatibility.
 * It will be removed in a future release.
 */
@Deprecated(forRemoval = true)
@Service
@Slf4j
public class BseStarMfService {

    public BseStarMfService() {
        log.warn("BseStarMfService is deprecated. Use dev.ongolebulls.bse.ucc.service.UccService instead.");
    }
}
