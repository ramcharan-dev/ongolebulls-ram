package dev.ongolebulls.repository;

import dev.ongolebulls.model.SeoSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeoSettingRepository extends JpaRepository<SeoSetting, Long> {
    SeoSetting findBySlug(String slug);
}

