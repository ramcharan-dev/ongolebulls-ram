package dev.ongolebulls;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class OngoleBullsApplication {
	public static void main(String[] args) {
		SpringApplication.run(OngoleBullsApplication.class, args);
	}
}

// Verify Properties are Loaded
@Component
class PropertyLogger implements CommandLineRunner {

	@Value("${spring.datasource.url}")
	private String datasourceUrl;

	@Override
	public void run(String... args) {
		System.out.println("Spring Boot is using Database URL: " + datasourceUrl);
	}
}



