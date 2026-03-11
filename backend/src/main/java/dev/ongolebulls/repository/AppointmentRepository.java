package dev.ongolebulls.repository;


import dev.ongolebulls.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}