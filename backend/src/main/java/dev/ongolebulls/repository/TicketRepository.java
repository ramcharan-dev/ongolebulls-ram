package dev.ongolebulls.repository;

import dev.ongolebulls.model.Ticket;
import dev.ongolebulls.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketId(String ticketId);
    List<Ticket> findByUserOrderByCreatedAtDesc(User user);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByStatusOrderByCreatedAtDesc(Ticket.TicketStatus status);
    long countByStatus(Ticket.TicketStatus status);

    // Support dashboard queries
    List<Ticket> findByAssignedToOrderByCreatedAtDesc(Long assignedTo);
    List<Ticket> findByAssignedToAndStatusOrderByCreatedAtDesc(Long assignedTo, Ticket.TicketStatus status);
    List<Ticket> findByPriorityAndStatusOrderByCreatedAtAsc(String priority, Ticket.TicketStatus status);
    long countByAssignedToAndStatusIn(Long assignedTo, java.util.Collection<Ticket.TicketStatus> statuses);
    long countByPriorityAndStatus(String priority, Ticket.TicketStatus status);
    List<Ticket> findByIsEscalatedTrueOrderByCreatedAtAsc();
    List<Ticket> findTop5ByStatusOrderByCreatedAtDesc(Ticket.TicketStatus status);
}

