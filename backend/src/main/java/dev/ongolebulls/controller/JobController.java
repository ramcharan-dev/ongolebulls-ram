package dev.ongolebulls.controller;

import dev.ongolebulls.model.Job;
import dev.ongolebulls.service.JobService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RestController
//@RequestMapping("/api/jobs")
//@CrossOrigin(origins = "*")
//public class JobController {
//    @Autowired
//    private JobService jobService;
//
//    @GetMapping
//    public List<Job> getJobs() {
//        return jobService.getAllJobs();
//    }
//
//    @PostMapping
//    public ResponseEntity<Job> addJob(@RequestBody Job job) {
//        return new ResponseEntity<>(jobService.createJob(job), HttpStatus.CREATED);
//    }
//
//
//}

@RestController
    @RequestMapping("/api/jobs")
//@RequestMapping("/api/admin/dashboard/jobs")
public class JobController {
//    @Autowired
//    private JobRepository jobRepository;
//
//    @GetMapping("/jobs")
//    public List<Job> getAllJobs() {
//        return jobRepository.findAll();
//    }
//
//    @PostMapping("/jobs")
//    public Job createJob(@RequestBody Job job) {
//        return jobRepository.save(job);
//    }


    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getJobs(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String remoteType
    ) {
        return ResponseEntity.ok(jobService.filterJobs(department, location, experience, remoteType));
    }

    @PostMapping
    public ResponseEntity<Job> addJob(@RequestBody Job job) {
        return new ResponseEntity<>(jobService.createJob(job), HttpStatus.CREATED);
    }

    @GetMapping("/departments")
    public List<String> getDepartments() {
        return jobService.getDistinctDepartments();
    }

    @GetMapping("/locations")
    public List<String> getLocations() {
        return jobService.getDistinctLocations();
    }

    @GetMapping("/experiences")
    public List<String> getExperiences() {
        return jobService.getDistinctExperiences();
    }

    @GetMapping("/worktypes")
    public List<String> getWorkTypes() {
        return jobService.getDistinctWorkTypes();
    }


    // Update job (PUT /api/jobs/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job job) {
        job.setId(id);
        Job updated = jobService.updateJob(id, job);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJobById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EntityNotFoundException e) {
            // Handle case where job doesn't exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");
        } catch (DataIntegrityViolationException e) {
            // Handle DB constraint issues (for example: foreign key violation)
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Job cannot be deleted due to related data");
        } catch (Exception e) {
            // For other errors, return error detail for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting job: " + e.getMessage());
        }
    }



}


