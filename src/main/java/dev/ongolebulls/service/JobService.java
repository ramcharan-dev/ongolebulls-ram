package dev.ongolebulls.service;

import dev.ongolebulls.model.Job;
import dev.ongolebulls.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }



    public List<Job> filterJobs(String department, String location, String experience, String remoteType) {
        return jobRepository.findByFilters(department, location, experience, remoteType);
    }

    // For dropdown filters
    public List<String> getDistinctDepartments() {
        return jobRepository.findDistinctDepartments();
    }
    public List<String> getDistinctLocations() {
        return jobRepository.findDistinctLocations();
    }
    public List<String> getDistinctExperiences() {
        return jobRepository.findDistinctExperiences();
    }
    public List<String> getDistinctWorkTypes() {
        return jobRepository.findDistinctWorkTypes();
    }


}
