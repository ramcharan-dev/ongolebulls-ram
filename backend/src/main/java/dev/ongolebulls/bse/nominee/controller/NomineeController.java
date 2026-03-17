package dev.ongolebulls.bse.nominee.controller;

import dev.ongolebulls.bse.nominee.dto.NomineeRequest;
import dev.ongolebulls.bse.nominee.dto.NomineeResponse;
import dev.ongolebulls.bse.nominee.service.NomineeService;
import dev.ongolebulls.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bse/nominee")
@CrossOrigin(originPatterns = "*")
@RequiredArgsConstructor
@Slf4j
public class NomineeController {

    private final NomineeService nomineeService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<NomineeResponse>> registerNominee(
            @RequestBody NomineeRequest request) {
        log.info("Nominee register request received for investorId={}", request.investorId());
        NomineeResponse response = nomineeService.registerNominee(request);
        String message = "SUCCESS".equals(response.status())
                ? "Nominee registered successfully"
                : "Nominee registration failed: " + response.message();
        return ResponseEntity.ok(ApiResponse.ok(message, response));
    }
}