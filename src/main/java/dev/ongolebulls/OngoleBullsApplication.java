package dev.ongolebulls;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "dev.ongolebulls.model")
@EnableJpaRepositories(basePackages = "dev.ongolebulls.repository")
public class OngoleBullsApplication {
	public static void main(String[] args) {
		SpringApplication.run(OngoleBullsApplication.class, args);
	}
}
