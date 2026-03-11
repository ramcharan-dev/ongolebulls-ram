package dev.ongolebulls.controller;

import dev.ongolebulls.dto.HelpTicketDto;
import dev.ongolebulls.dto.TicketReplyDto;
import dev.ongolebulls.model.Ticket;
import dev.ongolebulls.model.TicketReply;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.TicketRepository;
import dev.ongolebulls.repository.TicketReplyRepository;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/tickets")
public class AdminTicketController {

    private final TicketRepository ticketRepository;
    private final TicketReplyRepository ticketReplyRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AdminTicketController(TicketRepository ticketRepository,
                                TicketReplyRepository ticketReplyRepository,
                                UserRepository userRepository,
                                EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.ticketReplyRepository = ticketReplyRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<List<HelpTicketDto>> getAllTickets(
            @RequestParam(required = false) String status) {
        try {
            List<Ticket> tickets;
            if (status != null && !status.isEmpty()) {
                try {
                    Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
                    tickets = ticketRepository.findByStatusOrderByCreatedAtDesc(ticketStatus);
                } catch (IllegalArgumentException e) {
                    tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
                }
            } else {
                tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
            }

            List<HelpTicketDto> ticketDtos = tickets.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ticketDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<HelpTicketDto> getTicketDetails(@PathVariable String ticketId) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket ticket = ticketOpt.get();
            HelpTicketDto dto = convertToDto(ticket);
            
            // Load replies
            List<TicketReply> replies = ticketReplyRepository.findByTicketOrderByCreatedAtAsc(ticket);
            List<TicketReplyDto> replyDtos = replies.stream()
                    .map(this::convertReplyToDto)
                    .collect(Collectors.toList());
            dto.setReplies(replyDtos);

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<HelpTicketDto> updateTicketStatus(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> request) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket ticket = ticketOpt.get();
            String statusStr = request.get("status");
            String resolution = request.get("resolution");

            try {
                Ticket.TicketStatus newStatus = Ticket.TicketStatus.valueOf(statusStr.toUpperCase());
                ticket.setStatus(newStatus);
                if (resolution != null && !resolution.isEmpty()) {
                    ticket.setResolution(resolution);
                }
                ticket = ticketRepository.save(ticket);

                // Send email notification to user
                if (ticket.getUser() != null) {
                    Object userEmail = getField(ticket.getUser(), "email");
                    Object userName = getField(ticket.getUser(), "fullName");
                    if (userEmail != null && !userEmail.toString().isEmpty()) {
                        emailService.sendTicketStatusUpdate(
                                userEmail.toString(),
                                userName != null ? userName.toString() : "User",
                                ticket.getTicketId(),
                                newStatus.toString(),
                                resolution
                        );
                    }
                }

                return ResponseEntity.ok(convertToDto(ticket));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{ticketId}/reply")
    public ResponseEntity<TicketReplyDto> addReply(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> request) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket ticket = ticketOpt.get();
            TicketReply reply = new TicketReply();
            reply.setTicket(ticket);
            reply.setMessage(request.get("message"));
            reply.setFromSupport(true); // Admin reply
            reply.setRepliedBy(request.getOrDefault("repliedBy", "Support Team"));

            reply = ticketReplyRepository.save(reply);

            // Update ticket status to IN_PROGRESS if it was SUBMITTED
            if (ticket.getStatus() == Ticket.TicketStatus.SUBMITTED) {
                ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
                ticketRepository.save(ticket);
            }

            // Send email notification to user
            if (ticket.getUser() != null) {
                Object userEmail = getField(ticket.getUser(), "email");
                Object userName = getField(ticket.getUser(), "fullName");
                if (userEmail != null && !userEmail.toString().isEmpty()) {
                    emailService.sendTicketStatusUpdate(
                            userEmail.toString(),
                            userName != null ? userName.toString() : "User",
                            ticket.getTicketId(),
                            ticket.getStatus().toString(),
                            request.get("message")
                    );
                }
            }

            return ResponseEntity.ok(convertReplyToDto(reply));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTicketStats() {
        try {
            long total = ticketRepository.count();
            long submitted = ticketRepository.countByStatus(Ticket.TicketStatus.SUBMITTED);
            long inProgress = ticketRepository.countByStatus(Ticket.TicketStatus.IN_PROGRESS);
            long resolved = ticketRepository.countByStatus(Ticket.TicketStatus.RESOLVED);
            long closed = ticketRepository.countByStatus(Ticket.TicketStatus.CLOSED);

            return ResponseEntity.ok(Map.of(
                    "total", total,
                    "submitted", submitted,
                    "inProgress", inProgress,
                    "resolved", resolved,
                    "closed", closed
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    private HelpTicketDto convertToDto(Ticket ticket) {
        HelpTicketDto dto = new HelpTicketDto();
        Object id = getField(ticket, "id");
        Object ticketId = getField(ticket, "ticketId");
        Object issueType = getField(ticket, "issueType");
        Object description = getField(ticket, "description");
        Object status = getField(ticket, "status");
        Object createdAt = getField(ticket, "createdAt");
        Object updatedAt = getField(ticket, "updatedAt");
        Object resolvedAt = getField(ticket, "resolvedAt");
        Object resolution = getField(ticket, "resolution");
        Object attachmentName = getField(ticket, "attachmentName");

        if (id != null && id instanceof Long) {
            dto.setId((Long) id);
        }
        dto.setTicketId(ticketId != null ? ticketId.toString() : "");
        dto.setIssueType(issueType != null ? issueType.toString() : "");
        dto.setDescription(description != null ? description.toString() : "");
        if (status != null) {
            dto.setStatus(status.toString());
        }
        if (createdAt != null && createdAt instanceof LocalDateTime) {
            dto.setCreatedAt((LocalDateTime) createdAt);
        }
        if (updatedAt != null && updatedAt instanceof LocalDateTime) {
            dto.setUpdatedAt((LocalDateTime) updatedAt);
        }
        if (resolvedAt != null && resolvedAt instanceof LocalDateTime) {
            dto.setResolvedAt((LocalDateTime) resolvedAt);
        }
        dto.setResolution(resolution != null ? resolution.toString() : "");
        dto.setAttachmentName(attachmentName != null ? attachmentName.toString() : "");

        // Set user details
        if (ticket.getUser() != null) {
            Object userName = getField(ticket.getUser(), "fullName");
            Object userEmail = getField(ticket.getUser(), "email");
            dto.setUserName(userName != null ? userName.toString() : "");
            dto.setUserEmail(userEmail != null ? userEmail.toString() : "");
        }

        return dto;
    }

    private TicketReplyDto convertReplyToDto(TicketReply reply) {
        TicketReplyDto dto = new TicketReplyDto();
        Object id = getField(reply, "id");
        Object message = getField(reply, "message");
        Object isFromSupport = getField(reply, "isFromSupport");
        Object repliedBy = getField(reply, "repliedBy");
        Object createdAt = getField(reply, "createdAt");

        if (id != null && id instanceof Long) {
            dto.setId((Long) id);
        }
        dto.setMessage(message != null ? message.toString() : "");
        dto.setFromSupport(isFromSupport != null ? (Boolean) isFromSupport : false);
        dto.setRepliedBy(repliedBy != null ? repliedBy.toString() : "");
        if (createdAt != null && createdAt instanceof LocalDateTime) {
            dto.setCreatedAt((LocalDateTime) createdAt);
        }

        return dto;
    }

    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }
}

