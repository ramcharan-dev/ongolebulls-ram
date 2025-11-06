package dev.ongolebulls.service;

import dev.ongolebulls.model.Job;
import dev.ongolebulls.repository.JobRepository;
import jakarta.persistence.EntityNotFoundException;
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




    public void deleteJobById(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new EntityNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }


    public Job updateJob(Long id, Job job) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        // Update fields as needed:
        existingJob.setTitle(job.getTitle());
        existingJob.setDepartment(job.getDepartment());
        existingJob.setLocation(job.getLocation());
        existingJob.setExperience(job.getExperience());
        existingJob.setEmploymentType(job.getEmploymentType());
        existingJob.setDescription(job.getDescription());
        existingJob.setQualification(job.getQualification());
        existingJob.setSalaryRange(job.getSalaryRange());
        existingJob.setPostedDate(job.getPostedDate());
        existingJob.setApplyDeadline(job.getApplyDeadline());
        existingJob.setRemoteType(job.getRemoteType());
        existingJob.setSkillsRequired(job.getSkillsRequired());
        existingJob.setKeyResponsibility(job.getKeyResponsibility());
        existingJob.setRolesAndResponsibilities(job.getRolesAndResponsibilities());
        // Add other fields as needed

        return jobRepository.save(existingJob);
    }

}
