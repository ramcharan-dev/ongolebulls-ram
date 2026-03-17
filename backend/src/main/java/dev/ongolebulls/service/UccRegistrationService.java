package dev.ongolebulls.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.dto.UccDraftRequest;
import dev.ongolebulls.dto.UccStatusResponse;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.repository.UccRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UccRegistrationService {

    private final UccRegistrationRepository repository;
    private final ObjectMapper objectMapper;

    @Transactional
    public UccRegistration saveDraft(UccDraftRequest request) {
        UccRegistration reg = repository.findByUserId(request.getUserId())
                .orElse(UccRegistration.builder()
                        .userId(request.getUserId())
                        .status("DRAFT")
                        .build());

        // Only allow saving if DRAFT or FAILED (allow retry)
        if (!"DRAFT".equals(reg.getStatus()) && !"FAILED".equals(reg.getStatus())) {
            throw new IllegalStateException("Cannot modify UCC registration in " + reg.getStatus() + " state");
        }

        reg.setStatus("DRAFT");
        mapRequestToEntity(request, reg);
        return repository.save(reg);
    }

    @Transactional
    public UccRegistration submitRegistration(UccDraftRequest request) {
        UccRegistration reg = repository.findByUserId(request.getUserId())
                .orElse(UccRegistration.builder()
                        .userId(request.getUserId())
                        .build());

        // Allow submit from DRAFT or FAILED
        if (reg.getId() != null && !"DRAFT".equals(reg.getStatus()) && !"FAILED".equals(reg.getStatus())) {
            throw new IllegalStateException("Cannot submit UCC registration in " + reg.getStatus() + " state");
        }

        mapRequestToEntity(request, reg);
        validateAllSteps(reg);

        reg.setStatus("PENDING");
        reg.setErrorMessage(null);
        reg.setBseResponse(null);

        return repository.save(reg);
    }

    @Transactional
    public UccRegistration retrySubmission(Long userId) {
        UccRegistration reg = repository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No UCC registration found for user"));

        if (!"FAILED".equals(reg.getStatus())) {
            throw new IllegalStateException("Can only retry FAILED registrations");
        }

        reg.setStatus("PENDING");
        reg.setErrorMessage(null);
        reg.setBseResponse(null);
        reg.setRetryCount(0);

        return repository.save(reg);
    }

    public Optional<UccStatusResponse> getStatus(Long userId) {
        return repository.findByUserId(userId)
                .map(this::toStatusResponse);
    }

    private void mapRequestToEntity(UccDraftRequest request, UccRegistration reg) {
        if (request.getClientDetails() != null)
            reg.setClientDetailsJson(toJson(request.getClientDetails()));
        if (request.getJointHolder() != null)
            reg.setJointHolderJson(toJson(request.getJointHolder()));
        if (request.getGuardian() != null)
            reg.setGuardianJson(toJson(request.getGuardian()));
        if (request.getPanDetails() != null)
            reg.setPanDetailsJson(toJson(request.getPanDetails()));
        if (request.getClientType() != null)
            reg.setClientTypeJson(toJson(request.getClientType()));
        if (request.getBankDetails() != null)
            reg.setBankDetailsJson(toJson(request.getBankDetails()));
        if (request.getAddress() != null)
            reg.setAddressJson(toJson(request.getAddress()));
        if (request.getContact() != null)
            reg.setContactJson(toJson(request.getContact()));
        if (request.getCommunication() != null)
            reg.setCommunicationJson(toJson(request.getCommunication()));
        if (request.getNriDetails() != null)
            reg.setNriDetailsJson(toJson(request.getNriDetails()));
        if (request.getKyc() != null)
            reg.setKycJson(toJson(request.getKyc()));
        if (request.getAadhaar() != null)
            reg.setAadhaarJson(toJson(request.getAadhaar()));
        if (request.getDeclaration() != null)
            reg.setDeclarationJson(toJson(request.getDeclaration()));
        if (request.getNomination() != null)
            reg.setNominationJson(toJson(request.getNomination()));
        if (request.getNomineeDetails() != null)
            reg.setNomineeDetailsJson(toJson(request.getNomineeDetails()));
    }

    private void validateAllSteps(UccRegistration reg) {
        requireNonEmpty(reg.getClientDetailsJson(), "Client details are required");
        requireNonEmpty(reg.getPanDetailsJson(), "PAN details are required");
        requireNonEmpty(reg.getBankDetailsJson(), "Bank details are required");
        requireNonEmpty(reg.getAddressJson(), "Address details are required");
        requireNonEmpty(reg.getContactJson(), "Contact details are required");
        requireNonEmpty(reg.getCommunicationJson(), "Communication mode is required");
        requireNonEmpty(reg.getKycJson(), "KYC details are required");
        requireNonEmpty(reg.getAadhaarJson(), "Aadhaar details are required");
        requireNonEmpty(reg.getDeclarationJson(), "Declaration is required");
        requireNonEmpty(reg.getNominationJson(), "Nomination details are required");
    }

    private void requireNonEmpty(String json, String message) {
        if (json == null || json.isBlank() || "{}".equals(json.trim()) || "null".equals(json.trim())) {
            throw new IllegalArgumentException(message);
        }
    }

    private UccStatusResponse toStatusResponse(UccRegistration reg) {
        return UccStatusResponse.builder()
                .id(reg.getId())
                .userId(reg.getUserId())
                .clientCode(reg.getClientCode())
                .status(reg.getStatus())
                .errorMessage(reg.getErrorMessage())
                .createdAt(reg.getCreatedAt())
                .updatedAt(reg.getUpdatedAt())
                .clientDetails(fromJson(reg.getClientDetailsJson()))
                .jointHolder(fromJson(reg.getJointHolderJson()))
                .guardian(fromJson(reg.getGuardianJson()))
                .panDetails(fromJson(reg.getPanDetailsJson()))
                .clientType(fromJson(reg.getClientTypeJson()))
                .bankDetails(fromJson(reg.getBankDetailsJson()))
                .address(fromJson(reg.getAddressJson()))
                .contact(fromJson(reg.getContactJson()))
                .communication(fromJson(reg.getCommunicationJson()))
                .nriDetails(fromJson(reg.getNriDetailsJson()))
                .kyc(fromJson(reg.getKycJson()))
                .aadhaar(fromJson(reg.getAadhaarJson()))
                .declaration(fromJson(reg.getDeclarationJson()))
                .nomination(fromJson(reg.getNominationJson()))
                .nomineeDetails(fromJson(reg.getNomineeDetailsJson()))
                .build();
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize to JSON", e);
        }
    }

    private Object fromJson(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (JsonProcessingException e) {
            return json;
        }
    }
}
