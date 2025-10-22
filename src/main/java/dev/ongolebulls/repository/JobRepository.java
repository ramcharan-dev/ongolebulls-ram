package dev.ongolebulls.repository;

import dev.ongolebulls.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {




    @Query("SELECT DISTINCT j.department FROM Job j WHERE j.department IS NOT NULL")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT j.location FROM Job j WHERE j.location IS NOT NULL")
    List<String> findDistinctLocations();

    @Query("SELECT DISTINCT j.experience FROM Job j WHERE j.experience IS NOT NULL")
    List<String> findDistinctExperiences();

    @Query("SELECT DISTINCT j.remoteType FROM Job j WHERE j.remoteType IS NOT NULL")
    List<String> findDistinctWorkTypes();

    // Main filter method for the jobs search
    @Query("SELECT j FROM Job j WHERE "
            + "(:department IS NULL OR :department = '' OR j.department = :department) AND "
            + "(:location IS NULL OR :location = '' OR j.location = :location) AND "
            + "(:experience IS NULL OR :experience = '' OR j.experience = :experience) AND "
            + "(:remoteType IS NULL OR :remoteType = '' OR j.remoteType = :remoteType)")
    List<Job> findByFilters(
            @Param("department") String department,
            @Param("location") String location,
            @Param("experience") String experience,
            @Param("remoteType") String remoteType
    );
}