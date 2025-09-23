package dev.ongolebulls.service;


import dev.ongolebulls.model.Fund;
import dev.ongolebulls.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FundService {
    private final FundRepository fundRepository;

    public List<Fund> getAllFunds() {
        return fundRepository.findAll();
    }

    public List<Fund> filterFunds(List<String> risks, List<String> horizons, List<String> goals, List<String> assets) {
        return fundRepository.filterFunds(
                risks == null || risks.isEmpty() ? null : risks,
                horizons == null || horizons.isEmpty() ? null : horizons,
                goals == null || goals.isEmpty() ? null : goals,
                assets == null || assets.isEmpty() ? null : assets
        );
    }
}
