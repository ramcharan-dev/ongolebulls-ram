package dev.ongolebulls.service;

import dev.ongolebulls.model.Lead;
import dev.ongolebulls.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    @Transactional
    public Lead saveLead(Lead lead) {
        Lead saved = leadRepository.save(lead);
        leadRepository.flush();
        return saved;
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }
}
