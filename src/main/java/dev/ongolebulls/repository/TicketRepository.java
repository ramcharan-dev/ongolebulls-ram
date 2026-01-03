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
}

