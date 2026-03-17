package dev.ongolebulls;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = "dev.ongolebulls")
@EnableJpaRepositories(basePackages = "dev.ongolebulls")
@EnableScheduling // Enable scheduled tasks for market data updates
public class OngoleBullsApplication {
	public static void main(String[] args) {
		SpringApplication.run(OngoleBullsApplication.class, args);
	}
}
