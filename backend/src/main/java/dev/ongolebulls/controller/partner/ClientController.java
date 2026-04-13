package dev.ongolebulls.controller.partner;

import dev.ongolebulls.dto.partner.AddClientRequest;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.partner.ClientService;
import dev.ongolebulls.service.partner.PartnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("partnerClientController")
@RequestMapping("/api/partner/clients")
@RequiredArgsConstructor
@Slf4j
public class ClientController {

    private final PartnerService partnerService;
    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<?> addClient(Authentication auth, @RequestBody AddClientRequest request) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(clientService.addClient(partner, request));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not activated")) {
                return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getClients(
            Authentication auth,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String stage) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(clientService.getClients(partner.getId(), stage, search));
        } catch (Exception e) {
            log.error("Error fetching clients: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{clientId}/lifecycle")
    public ResponseEntity<?> updateClientLifecycle(
            Authentication auth,
            @PathVariable Long clientId,
            @RequestBody Map<String, String> body) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(clientService.updateClientLifecycle(partner, clientId, body.get("stage")));
        } catch (Exception e) {
            log.error("Error updating client lifecycle: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
