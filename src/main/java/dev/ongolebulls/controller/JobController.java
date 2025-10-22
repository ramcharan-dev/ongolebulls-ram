package dev.ongolebulls.controller;

import dev.ongolebulls.model.Job;
import dev.ongolebulls.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
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
@CrossOrigin(origins = "*")
public class JobController {
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





}


