package dev.ongolebulls.bse.elog.controller;

import dev.ongolebulls.bse.elog.dto.ElogRequest;
import dev.ongolebulls.bse.elog.dto.ElogResponse;
import dev.ongolebulls.bse.elog.model.InvestorElog;
import dev.ongolebulls.bse.elog.repository.InvestorElogRepository;
import dev.ongolebulls.bse.elog.service.ElogService;
import dev.ongolebulls.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/bse/elog")
@CrossOrigin(originPatterns = "*")
@RequiredArgsConstructor
@Slf4j
public class ElogController {

    private final ElogService elogService;
    private final InvestorElogRepository elogRepository;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ElogResponse>> generateElog(
            @RequestBody ElogRequest request) {
        log.info("ELOG generate request received for investorId={}", request.investorId());
        ElogResponse response = elogService.generateElog(request);
        String message = "SUCCESS".equals(response.status())
                ? "ELOG generated successfully"
                : "ELOG generation failed: " + response.message();
        return ResponseEntity.ok(ApiResponse.ok(message, response));
    }

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<String>> handleCallback(
            @RequestParam(value = "STATUS", required = false) String status,
            @RequestParam(value = "elgstatus", required = false) String elgStatus,
            @RequestParam(value = "intrefno", required = false) String intRefNo,
            @RequestParam(value = "clientcode", required = false) String clientCode) {

        log.info("ELOG callback received: STATUS={}, elgstatus={}, intrefno={}, clientcode={}",
                status, elgStatus, intRefNo, clientCode);

        InvestorElog elog = null;

        if (intRefNo != null && !intRefNo.isBlank()) {
            elog = elogRepository.findByIntRefNo(intRefNo).orElse(null);
        }

        if (elog == null && clientCode != null && !clientCode.isBlank()) {
            elog = elogRepository.findTopByClientCodeOrderByCreatedAtDesc(clientCode).orElse(null);
        }

        if (elog == null) {
            log.warn("ELOG callback: no matching record found for intrefno={}, clientcode={}",
                    intRefNo, clientCode);
            return ResponseEntity.ok(ApiResponse.fail("No matching ELOG record found"));
        }

        if ("SUCCESS".equalsIgnoreCase(status)) {
            elog.setCallbackStatus("SUCCESS");
            elog.setVerifiedAt(Instant.now());
        } else {
            elog.setCallbackStatus("FAILED");
        }
        elogRepository.save(elog);

        log.info("ELOG callback processed: elogId={}, callbackStatus={}",
                elog.getId(), elog.getCallbackStatus());

        return ResponseEntity.ok(ApiResponse.ok(
                "Investor ELOG verification processed", elog.getCallbackStatus()));
    }
}
