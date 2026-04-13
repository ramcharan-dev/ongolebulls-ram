package dev.ongolebulls.service.rm;

import dev.ongolebulls.dto.rm.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.TaskRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RMService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    private static final List<Role> PARTNER_ROLES = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);

    public User getCurrentRM(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("RM not found"));
    }

    // ── Stats ────────────────────────────────────────────────────────────

    public RMStatsResponse getStats(Long rmId) {
        long total = userRepository.countByAssignedRmIdAndRoleIn(rmId, PARTNER_ROLES);
        long active = userRepository.countByAssignedRmIdAndRoleInAndIsActivated(rmId, PARTNER_ROLES, true);
        long pending = total - active;

        // Count total clients across all assigned partners
        List<User> partners = userRepository.findByAssignedRmIdAndRoleIn(rmId, PARTNER_ROLES);
        long totalClients = 0;
        for (User partner : partners) {
            totalClients += userRepository.countByAssignedPartnerId(partner.getId());
        }

        List<RMPartnerSummary> pendingPartners = userRepository
                .findTop5ByAssignedRmIdAndRoleInAndIsActivatedOrderByCreatedAtAsc(rmId, PARTNER_ROLES, false)
                .stream().map(this::toPartnerSummary).toList();

        List<RMPartnerSummary> recentPartners = userRepository
                .findTop5ByAssignedRmIdAndRoleInOrderByCreatedAtDesc(rmId, PARTNER_ROLES)
                .stream().map(this::toPartnerSummary).toList();

        return RMStatsResponse.builder()
                .totalPartners(total)
                .activePartners(active)
                .pendingActivation(pending)
                .totalClients(totalClients)
                .pendingPartners(pendingPartners)
                .recentPartners(recentPartners)
                .build();
    }

    // ── Partners ─────────────────────────────────────────────────────────

    public List<RMPartnerSummary> getPartners(Long rmId, String search, String status, String type) {
        List<User> partners;

        if (search != null && !search.isBlank()) {
            partners = userRepository.searchPartnersByRm(rmId, PARTNER_ROLES, search);
        } else {
            partners = userRepository.findByAssignedRmIdAndRoleIn(rmId, PARTNER_ROLES);
        }

        // Filter by status
        if ("active".equalsIgnoreCase(status)) {
            partners = partners.stream().filter(User::isActivated).collect(Collectors.toList());
        } else if ("pending".equalsIgnoreCase(status)) {
            partners = partners.stream().filter(p -> !p.isActivated()).collect(Collectors.toList());
        }

        // Filter by type
        if ("INDIVIDUAL_PARTNER".equalsIgnoreCase(type)) {
            partners = partners.stream().filter(p -> p.getRole() == Role.INDIVIDUAL_PARTNER).collect(Collectors.toList());
        } else if ("NON_INDIVIDUAL_PARTNER".equalsIgnoreCase(type)) {
            partners = partners.stream().filter(p -> p.getRole() == Role.NON_INDIVIDUAL_PARTNER).collect(Collectors.toList());
        }

        // Sort by createdAt desc
        partners.sort((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        return partners.stream().map(this::toPartnerSummary).toList();
    }

    // ── Performance ──────────────────────────────────────────────────────

    public PerformanceResponse getPerformance(Long rmId) {
        List<User> partners = userRepository.findByAssignedRmIdAndRoleIn(rmId, PARTNER_ROLES);
        long activePartners = partners.stream().filter(User::isActivated).count();
        long pendingPartners = partners.size() - activePartners;

        // Aggregate client lifecycle stages across all partners
        Map<String, Long> clientsByStage = new LinkedHashMap<>();
        for (LifecycleStage stage : LifecycleStage.values()) {
            clientsByStage.put(stage.name(), 0L);
        }

        long totalClients = 0;
        List<PerformanceResponse.TopPartner> topPartners = new ArrayList<>();

        for (User partner : partners) {
            long clientCount = userRepository.countByAssignedPartnerId(partner.getId());
            totalClients += clientCount;

            long activeInvestors = userRepository.countByAssignedPartnerIdAndLifecycleStage(
                    partner.getId(), LifecycleStage.ACTIVE_INVESTOR);

            topPartners.add(PerformanceResponse.TopPartner.builder()
                    .partnerName(partner.getFullName() != null ? partner.getFullName() : partner.getFirmName())
                    .clients(clientCount)
                    .activeInvestors(activeInvestors)
                    .isActivated(partner.isActivated())
                    .build());

            // Aggregate lifecycle stages
            for (LifecycleStage stage : LifecycleStage.values()) {
                long count = userRepository.countByAssignedPartnerIdAndLifecycleStage(partner.getId(), stage);
                clientsByStage.merge(stage.name(), count, Long::sum);
            }
        }

        // Sort top partners by client count and take top 5
        topPartners.sort((a, b) -> Long.compare(b.getClients(), a.getClients()));
        if (topPartners.size() > 5) topPartners = topPartners.subList(0, 5);
        for (int i = 0; i < topPartners.size(); i++) {
            topPartners.get(i).setRank(i + 1);
        }

        return PerformanceResponse.builder()
                .totalClients(totalClients)
                .clientsByStage(clientsByStage)
                .activePartners(activePartners)
                .pendingPartners(pendingPartners)
                .topPartners(topPartners)
                .build();
    }

    // ── Tasks ────────────────────────────────────────────────────────────

    public Map<String, List<TaskResponse>> getTasks(Long rmId) {
        List<TaskResponse> pending = taskRepository.findByRmIdAndIsCompletedFalseOrderByDueDateAsc(rmId)
                .stream().map(this::toTaskResponse).toList();
        List<TaskResponse> completed = taskRepository.findByRmIdAndIsCompletedTrueOrderByCompletedAtDesc(rmId)
                .stream().map(this::toTaskResponse).toList();
        return Map.of("pending", pending, "completed", completed);
    }

    public TaskResponse createTask(Long rmId, TaskRequest req) {
        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new RuntimeException("Title is required");
        }

        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() != null ? Task.Priority.valueOf(req.getPriority()) : Task.Priority.MEDIUM)
                .dueDate(req.getDueDate() != null ? LocalDate.parse(req.getDueDate()) : null)
                .isCompleted(false)
                .rmId(rmId)
                .relatedPartnerId(req.getRelatedPartnerId())
                .build();

        taskRepository.save(task);
        log.info("RM {} created task: {}", rmId, task.getTitle());
        return toTaskResponse(task);
    }

    public TaskResponse completeTask(Long rmId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getRmId().equals(rmId)) {
            throw new RuntimeException("Task does not belong to this RM");
        }
        task.setIsCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);
        return toTaskResponse(task);
    }

    public TaskResponse reopenTask(Long rmId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getRmId().equals(rmId)) {
            throw new RuntimeException("Task does not belong to this RM");
        }
        task.setIsCompleted(false);
        task.setCompletedAt(null);
        taskRepository.save(task);
        return toTaskResponse(task);
    }

    public void deleteTask(Long rmId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getRmId().equals(rmId)) {
            throw new RuntimeException("Task does not belong to this RM");
        }
        taskRepository.delete(task);
        log.info("RM {} deleted task {}", rmId, taskId);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private RMPartnerSummary toPartnerSummary(User partner) {
        long clientCount = userRepository.countByAssignedPartnerId(partner.getId());
        return RMPartnerSummary.builder()
                .id(partner.getId())
                .fullName(partner.getFullName())
                .firmName(partner.getFirmName())
                .email(partner.getEmail())
                .mobileNumber(partner.getMobileNumber())
                .partnerType(partner.getRole().name())
                .arn(partner.getArn())
                .pan(partner.getPan())
                .euin(partner.getEuin())
                .partnerBankAccount(partner.getPartnerBankAccount())
                .partnerIfsc(partner.getPartnerIfsc())
                .partnerBankName(partner.getPartnerBankName())
                .isActivated(partner.isActivated())
                .clientCount(clientCount)
                .createdAt(partner.getCreatedAt())
                .build();
    }

    private TaskResponse toTaskResponse(Task task) {
        String partnerName = null;
        if (task.getRelatedPartnerId() != null) {
            partnerName = userRepository.findById(task.getRelatedPartnerId())
                    .map(u -> u.getFullName() != null ? u.getFullName() : u.getFirmName())
                    .orElse(null);
        }
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .isCompleted(Boolean.TRUE.equals(task.getIsCompleted()))
                .relatedPartnerId(task.getRelatedPartnerId())
                .relatedPartnerName(partnerName)
                .createdAt(task.getCreatedAt())
                .completedAt(task.getCompletedAt())
                .build();
    }
}
