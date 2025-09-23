package dev.ongolebulls.repository;

import dev.ongolebulls.model.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FundRepository extends JpaRepository<Fund, Long> {

    @Query("SELECT f FROM Fund f " +
            "WHERE (:risks IS NULL OR f.risk IN :risks) " +
            "AND (:horizons IS NULL OR f.horizon IN :horizons) " +
            "AND (:goals IS NULL OR f.goal IN :goals) " +
            "AND (:assets IS NULL OR f.assetType IN :assets)")
    List<Fund> filterFunds(@Param("risks") List<String> risks,
                           @Param("horizons") List<String> horizons,
                           @Param("goals") List<String> goals,
                           @Param("assets") List<String> assets);
}
