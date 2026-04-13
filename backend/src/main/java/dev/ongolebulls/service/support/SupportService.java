package dev.ongolebulls.service.support;

import dev.ongolebulls.dto.support.*;
import dev.ongolebulls.model.Ticket;
import dev.ongolebulls.model.Ticket.TicketStatus;
import dev.ongolebulls.model.TicketReply;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.TicketRepository;
import dev.ongolebulls.repository.TicketReplyRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportService {

    private final TicketRepository ticketRepository;
    private final TicketReplyRepository ticketReplyRepository;
    private final UserRepository userRepository;

    public User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public SupportStatsResponse getStats(Long userId) {
        long openTickets = ticketRepository.countByStatus(TicketStatus.SUBMITTED);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);

        // Resolved today
        List<Ticket> resolvedTickets = ticketRepository.findByStatusOrderByCreatedAtDesc(TicketStatus.RESOLVED);
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        long resolvedToday = resolvedTickets.stream()
                .filter(t -> t.getResolvedAt() != null && t.getResolvedAt().isAfter(todayStart))
                .count();

        // My open tickets
        long myOpenTickets = ticketRepository.countByAssignedToAndStatusIn(
                userId, List.of(TicketStatus.SUBMITTED, TicketStatus.IN_PROGRESS));

        // High priority open
        long highPriorityOpen = ticketRepository.countByPriorityAndStatus("HIGH", TicketStatus.SUBMITTED);

        // Average resolution hours
        double avgResolutionHours = resolvedTickets.stream()
                .filter(t -> t.getResolvedAt() != null && t.getCreatedAt() != null)
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toHours())
                .average()
                .orElse(0.0);

        return SupportStatsResponse.builder()
                .openTickets(openTickets)
                .inProgressTickets(inProgressTickets)
                .resolvedToday(resolvedToday)
                .myOpenTickets(myOpenTickets)
                .highPriorityOpen(highPriorityOpen)
                .avgResolutionHours(Math.round(avgResolutionHours * 10.0) / 10.0)
                .build();
    }

    public List<TicketResponse> getTickets(String status, String priority, String category, String search) {
        List<Ticket> tickets = ticketRepository.findAllByOrderByCreatedAtDesc();

        return tickets.stream()
                .filter(t -> status == null || status.isEmpty() || t.getStatus().name().equalsIgnoreCase(status))
                .filter(t -> priority == null || priority.isEmpty() || (t.getPriority() != null && t.getPriority().equalsIgnoreCase(priority)))
                .filter(t -> category == null || category.isEmpty() || (t.getIssueType() != null && t.getIssueType().equalsIgnoreCase(category)))
                .filter(t -> {
                    if (search == null || search.isEmpty()) return true;
                    String lowerSearch = search.toLowerCase();
                    boolean matchesTicketId = t.getTicketId() != null && t.getTicketId().toLowerCase().contains(lowerSearch);
                    boolean matchesUserName = t.getUser() != null && t.getUser().getFullName() != null
                            && t.getUser().getFullName().toLowerCase().contains(lowerSearch);
                    return matchesTicketId || matchesUserName;
                })
                .map(this::toTicketResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getMyTickets(Long userId) {
        List<Ticket> tickets = ticketRepository.findByAssignedToOrderByCreatedAtDesc(userId);
        return tickets.stream()
                .map(this::toTicketResponse)
                .collect(Collectors.toList());
    }

    public TicketDetailResponse getTicketDetail(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        List<TicketReplyResponse> replies = ticket.getReplies().stream()
                .map(r -> TicketReplyResponse.builder()
                        .id(r.getId())
                        .message(r.getMessage())
                        .isFromSupport(r.isFromSupport())
                        .repliedBy(r.getRepliedBy())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        User raisedBy = ticket.getUser();

        return TicketDetailResponse.builder()
                .id(ticket.getId())
                .ticketId(ticket.getTicketId())
                .subject(ticket.getIssueType())
                .description(ticket.getDescription())
                .category(ticket.getIssueType())
                .priority(ticket.getPriority())
                .status(ticket.getStatus().name())
                .raisedByName(raisedBy != null ? raisedBy.getFullName() : null)
                .raisedByEmail(raisedBy != null ? raisedBy.getEmail() : null)
                .raisedById(raisedBy != null ? raisedBy.getId() : null)
                .raisedByRole(raisedBy != null && raisedBy.getRole() != null ? raisedBy.getRole().name() : null)
                .assignedToName(ticket.getAssignedToName())
                .assignedTo(ticket.getAssignedTo())
                .isEscalated(Boolean.TRUE.equals(ticket.getIsEscalated()))
                .resolution(ticket.getResolution())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .replies(replies)
                .build();
    }

    @Transactional
    public TicketReplyResponse addReply(Long ticketId, String message, boolean isInternal, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        TicketReply reply = new TicketReply();
        reply.setTicket(ticket);
        reply.setMessage(message);
        reply.setFromSupport(isInternal);
        reply.setRepliedBy(user.getFullName());

        ticketReplyRepository.save(reply);

        return TicketReplyResponse.builder()
                .id(reply.getId())
                .message(reply.getMessage())
                .isFromSupport(reply.isFromSupport())
                .repliedBy(reply.getRepliedBy())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    @Transactional
    public TicketResponse updateStatus(Long ticketId, String newStatus, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        TicketStatus status = TicketStatus.valueOf(newStatus.toUpperCase());
        ticket.setStatus(status);

        if (status == TicketStatus.RESOLVED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    @Transactional
    public TicketResponse assignTicket(Long ticketId, Long assignToUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        User assignee = userRepository.findById(assignToUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + assignToUserId));

        ticket.setAssignedTo(assignee.getId());
        ticket.setAssignedToName(assignee.getFullName());

        ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    @Transactional
    public TicketResponse escalateTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        ticket.setIsEscalated(true);
        ticketRepository.save(ticket);
        return toTicketResponse(ticket);
    }

    public List<EscalationResponse> getEscalations() {
        LocalDateTime now = LocalDateTime.now();

        List<Ticket> allTickets = ticketRepository.findAllByOrderByCreatedAtDesc();

        return allTickets.stream()
                .filter(t -> {
                    // Explicitly escalated
                    if (Boolean.TRUE.equals(t.getIsEscalated())) return true;
                    // SUBMITTED and older than 24 hours
                    if (t.getStatus() == TicketStatus.SUBMITTED && t.getCreatedAt() != null
                            && Duration.between(t.getCreatedAt(), now).toHours() > 24) return true;
                    // HIGH priority, SUBMITTED, older than 4 hours
                    if ("HIGH".equalsIgnoreCase(t.getPriority()) && t.getStatus() == TicketStatus.SUBMITTED
                            && t.getCreatedAt() != null
                            && Duration.between(t.getCreatedAt(), now).toHours() > 4) return true;
                    return false;
                })
                .map(t -> {
                    long hoursOpen = t.getCreatedAt() != null
                            ? Duration.between(t.getCreatedAt(), now).toHours()
                            : 0;

                    User raisedBy = t.getUser();

                    return EscalationResponse.builder()
                            .id(t.getId())
                            .ticketId(t.getTicketId())
                            .subject(t.getIssueType())
                            .priority(t.getPriority())
                            .status(t.getStatus().name())
                            .raisedByName(raisedBy != null ? raisedBy.getFullName() : null)
                            .assignedTo(t.getAssignedTo())
                            .assignedToName(t.getAssignedToName())
                            .hoursOpen(hoursOpen)
                            .replyCount(t.getReplies() != null ? t.getReplies().size() : 0)
                            .isEscalated(Boolean.TRUE.equals(t.getIsEscalated()))
                            .createdAt(t.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private TicketResponse toTicketResponse(Ticket ticket) {
        User raisedBy = ticket.getUser();

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketId(ticket.getTicketId())
                .subject(ticket.getIssueType())
                .description(ticket.getDescription())
                .category(ticket.getIssueType())
                .priority(ticket.getPriority())
                .status(ticket.getStatus().name())
                .raisedByName(raisedBy != null ? raisedBy.getFullName() : null)
                .raisedByEmail(raisedBy != null ? raisedBy.getEmail() : null)
                .raisedById(raisedBy != null ? raisedBy.getId() : null)
                .assignedToName(ticket.getAssignedToName())
                .assignedTo(ticket.getAssignedTo())
                .isEscalated(Boolean.TRUE.equals(ticket.getIsEscalated()))
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .replyCount(ticket.getReplies() != null ? ticket.getReplies().size() : 0)
                .build();
    }
}
