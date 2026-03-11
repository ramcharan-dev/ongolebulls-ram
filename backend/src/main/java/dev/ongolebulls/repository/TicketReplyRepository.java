package dev.ongolebulls.repository;

import dev.ongolebulls.model.Ticket;
import dev.ongolebulls.model.TicketReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketReplyRepository extends JpaRepository<TicketReply, Long> {
    List<TicketReply> findByTicketOrderByCreatedAtAsc(Ticket ticket);
    List<TicketReply> findByTicket(Ticket ticket);
    
    // Native query to delete replies without needing created_at column
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM ticket_replies WHERE ticket_id = :ticketId", nativeQuery = true)
    void deleteByTicketId(@Param("ticketId") Long ticketId);
}

