package dev.ongolebulls.service;

import dev.ongolebulls.model.CandidateApplication;
import dev.ongolebulls.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public void saveCandidate(CandidateApplication candidate) {
        candidateRepository.save(candidate);
    }


}
