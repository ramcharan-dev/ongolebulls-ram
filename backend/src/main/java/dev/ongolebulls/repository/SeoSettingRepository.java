package dev.ongolebulls.repository;

import dev.ongolebulls.model.SeoSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeoSettingRepository extends JpaRepository<SeoSetting, Long> {

}
