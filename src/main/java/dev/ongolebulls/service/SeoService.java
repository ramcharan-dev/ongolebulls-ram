package dev.ongolebulls.service;


import java.time.LocalDateTime;
import java.util.List;

import aj.org.objectweb.asm.commons.Remapper;
import dev.ongolebulls.model.SeoSetting;
import dev.ongolebulls.repository.SeoSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class SeoService {

    @Autowired
    private SeoSettingRepository seoRepo;

    // Get All SEO Pages
    public List<SeoSetting> getAllSeoSettings() {
        return seoRepo.findAll();
    }

    // Get By ID
    public SeoSetting getSeoById(Long id) {
        return seoRepo.findById(id).orElse(new SeoSetting());
    }

    // Save / Update
    public SeoSetting saveSeo(SeoSetting seo) {
        seo.setUpdatedAt(LocalDateTime.now());
        return seoRepo.save(seo);
    }

    public void deleteSeo(Long id) {
        seoRepo.deleteById(id);
    }



}


