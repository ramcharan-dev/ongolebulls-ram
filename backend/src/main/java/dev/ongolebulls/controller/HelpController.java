package dev.ongolebulls.controller;

import dev.ongolebulls.dto.HelpTicketDto;
import dev.ongolebulls.dto.RelationshipManagerDto;
import dev.ongolebulls.dto.TicketReplyDto;
import dev.ongolebulls.model.Ticket;
import dev.ongolebulls.model.TicketReply;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.TicketRepository;
import dev.ongolebulls.repository.TicketReplyRepository;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/help")
public class HelpController {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final TicketReplyRepository ticketReplyRepository;
    private final EmailService emailService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    private static final String UPLOAD_DIR = "uploads/tickets/";
    private static final String SUPPORT_EMAIL = "info@ongolebullsinvest.com";

    public HelpController(UserRepository userRepository, 
                         TicketRepository ticketRepository,
                         TicketReplyRepository ticketReplyRepository,
                         EmailService emailService) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.ticketReplyRepository = ticketReplyRepository;
        this.emailService = emailService;
        
        // Create upload directory if it doesn't exist
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            System.err.println("Failed to create upload directory: " + e.getMessage());
        }
    }

    @GetMapping("/rm/{userId}")
    public ResponseEntity<RelationshipManagerDto> getRelationshipManager(@PathVariable Long userId) {
        try {
            RelationshipManagerDto rm = new RelationshipManagerDto();
            setField(rm, "name", "Rajesh Kumar");
            setField(rm, "phone", "+91 98765 43210");
            setField(rm, "email", "rm@ongolebulls.com");
            setField(rm, "designation", "Senior Relationship Manager");
            setField(rm, "officeAddress", "123 Financial District, Mumbai - 400001");
            return ResponseEntity.ok(rm);
        } catch (Exception e) {
            return ResponseEntity.ok(new RelationshipManagerDto());
        }
    }

    @GetMapping("/tickets/{userId}")
    public ResponseEntity<List<HelpTicketDto>> getTickets(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            List<Ticket> tickets = ticketRepository.findByUserOrderByCreatedAtDesc(user);
            List<HelpTicketDto> ticketDtos = tickets.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ticketDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/tickets/{userId}/{ticketId}")
    public ResponseEntity<HelpTicketDto> getTicketDetails(
            @PathVariable Long userId,
            @PathVariable String ticketId) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket ticket = ticketOpt.get();
            // Verify ticket belongs to user
            Object user = getField(ticket, "user");
            if (user != null) {
                Object ticketUserId = getField(user, "id");
                if (ticketUserId != null && !ticketUserId.equals(userId)) {
                    return ResponseEntity.status(403).build();
                }
            }

            HelpTicketDto dto = convertToDto(ticket);
            // Load replies
            List<TicketReply> replies;
            try {
                replies = ticketReplyRepository.findByTicketOrderByCreatedAtAsc(ticket);
            } catch (Exception e) {
                // Fallback if createdAt column doesn't exist in database
                replies = ticketReplyRepository.findByTicket(ticket);
            }
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

    @PostMapping(value = "/tickets/{userId}", consumes = {"multipart/form-data"})
    public ResponseEntity<HelpTicketDto> createTicket(
            @PathVariable Long userId,
            @RequestPart("issueType") String issueType,
            @RequestPart("description") String description,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            Ticket ticket = new Ticket();
            ticket.setUser(user);
            ticket.setIssueType(issueType);
            ticket.setDescription(description);
            ticket.setStatus(Ticket.TicketStatus.SUBMITTED);

            // Handle file upload
            if (attachment != null && !attachment.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + attachment.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.copy(attachment.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                ticket.setAttachmentPath(filePath.toString());
                ticket.setAttachmentName(attachment.getOriginalFilename());
            }

            ticket = ticketRepository.save(ticket);

            // Get user details for email
            Object userEmail = getField(user, "email");
            Object userName = getField(user, "fullName");
            String email = userEmail != null ? userEmail.toString() : "";
            String name = userName != null ? userName.toString() : "User";

            // Send acknowledgement email to user
            if (!email.isEmpty()) {
                emailService.sendTicketAcknowledgement(email, name, ticket.getTicketId(), issueType);
            }

            // Send notification email to support team
            emailService.sendTicketNotificationToSupport(
                    SUPPORT_EMAIL,
                    ticket.getTicketId(),
                    name,
                    email,
                    issueType,
                    description
            );

            HelpTicketDto dto = convertToDto(ticket);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/tickets/{userId}/{ticketId}/reply")
    public ResponseEntity<TicketReplyDto> addReply(
            @PathVariable Long userId,
            @PathVariable String ticketId,
            @RequestBody Map<String, String> request) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket ticket = ticketOpt.get();
            // Verify ticket belongs to user
            Object user = getField(ticket, "user");
            if (user != null) {
                Object ticketUserId = getField(user, "id");
                if (ticketUserId != null && !ticketUserId.equals(userId)) {
                    return ResponseEntity.status(403).build();
                }
            }

            TicketReply reply = new TicketReply();
            reply.setTicket(ticket);
            reply.setMessage(request.get("message"));
            reply.setFromSupport(false); // User reply
            Object userName = getField(ticket.getUser(), "fullName");
            reply.setRepliedBy(userName != null ? userName.toString() : "User");

            reply = ticketReplyRepository.save(reply);

            return ResponseEntity.ok(convertReplyToDto(reply));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/tickets/{userId}/{ticketId}")
    @Transactional
    public ResponseEntity<?> deleteTicket(
            @PathVariable Long userId,
            @PathVariable String ticketId) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findByTicketId(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Ticket not found"));
            }

            Ticket ticket = ticketOpt.get();
            
            // Verify ticket belongs to user
            Object user = getField(ticket, "user");
            if (user != null) {
                Object ticketUserId = getField(user, "id");
                if (ticketUserId != null && !ticketUserId.equals(userId)) {
                    return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to delete this ticket"));
                }
            }

            // Get ticket ID for deletion
            Object ticketIdObj = getField(ticket, "id");
            if (ticketIdObj == null || !(ticketIdObj instanceof Long)) {
                return ResponseEntity.status(500).body(Map.of("error", "Invalid ticket data"));
            }
            Long ticketDbId = (Long) ticketIdObj;

            // Delete attachment file if exists (do this before deleting from DB)
            Object attachmentPath = getField(ticket, "attachmentPath");
            if (attachmentPath != null && !attachmentPath.toString().isEmpty()) {
                try {
                    Path filePath = Paths.get(attachmentPath.toString());
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                    }
                } catch (IOException e) {
                    System.err.println("Error deleting attachment file: " + e.getMessage());
                    // Continue with ticket deletion even if file deletion fails
                }
            }

            // Delete replies using native query (avoids loading entities with missing created_at column)
            try {
                Query deleteRepliesQuery = entityManager.createNativeQuery(
                    "DELETE FROM ticket_replies WHERE ticket_id = :ticketId"
                );
                deleteRepliesQuery.setParameter("ticketId", ticketDbId);
                deleteRepliesQuery.executeUpdate();
            } catch (Exception e) {
                System.err.println("Warning: Could not delete ticket replies: " + e.getMessage());
                e.printStackTrace();
                // Continue with ticket deletion
            }

            // Delete the ticket using native query to avoid loading related entities
            try {
                Query deleteTicketQuery = entityManager.createNativeQuery(
                    "DELETE FROM tickets WHERE id = :ticketId"
                );
                deleteTicketQuery.setParameter("ticketId", ticketDbId);
                int deleted = deleteTicketQuery.executeUpdate();
                
                if (deleted == 0) {
                    return ResponseEntity.status(404).body(Map.of("error", "Ticket not found or already deleted"));
                }
            } catch (Exception e) {
                System.err.println("Error deleting ticket: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body(Map.of("error", "Failed to delete ticket: " + e.getMessage()));
            }

            return ResponseEntity.ok(Map.of("success", true, "message", "Ticket deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error occurred";
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete ticket: " + errorMessage));
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
        Object attachmentPath = getField(ticket, "attachmentPath");

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
        dto.setAttachmentPath(attachmentPath != null ? attachmentPath.toString() : "");

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

    @GetMapping("/faqs")
    public ResponseEntity<List<Map<String, String>>> getFAQs(@RequestParam(required = false) String query) {
        try {
            List<Map<String, String>> faqs = new ArrayList<>();
            
            // Sample FAQs
            String[][] faqData = {
                {"How to Invest?", "You can invest through the 'Invest More' button on your dashboard. Choose a fund and enter the amount."},
                {"SIP Help", "SIPs allow you to invest a fixed amount monthly. Go to 'SIPs' section to start a new SIP."},
                {"KYC Process", "KYC is mandatory for investments. Upload your documents through the profile section."},
                {"Payment Methods", "We accept UPI, Net Banking, and Debit Cards for investments."},
                {"Redemption Process", "You can redeem investments through the 'Redeem' option. Funds are credited within 2-3 business days."}
            };

            for (String[] faq : faqData) {
                if (query == null || query.isEmpty() || faq[0].toLowerCase().contains(query.toLowerCase())) {
                    Map<String, String> faqMap = new HashMap<>();
                    faqMap.put("question", faq[0]);
                    faqMap.put("answer", faq[1]);
                    faqs.add(faqMap);
                }
            }

            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore
        }
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


