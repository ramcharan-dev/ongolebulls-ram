package dev.ongolebulls.controller;

import dev.ongolebulls.dto.ClientSummaryResponse;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clients")
@RequiredArgsConstructor
public class AdminClientController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ClientSummaryResponse>> listClients(
            @RequestParam(required = false) String search
    ) {
        List<User> clients = userRepository.findByRole(Role.USER);

        List<ClientSummaryResponse> result = clients.stream()
                .filter(c -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.toLowerCase();
                    String name = c.getFullName() != null ? c.getFullName().toLowerCase() : "";
                    String email = c.getEmail() != null ? c.getEmail().toLowerCase() : "";
                    return name.contains(q) || email.contains(q);
                })
                .map(this::toClientSummary)
                .toList();

        return ResponseEntity.ok(result);
    }

    private ClientSummaryResponse toClientSummary(User u) {
        // TODO: join KycDetails to determine actual KYC status
        String kycStatus = u.getKycDetails() != null ? "Submitted" : "Not Started";

        return ClientSummaryResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .mobileNumber(u.getMobileNumber())
                .isActivated(u.isActivated())
                .createdAt(u.getCreatedAt())
                .kycStatus(kycStatus)
                .assignedPartnerName(null)
                .build();
    }
}
