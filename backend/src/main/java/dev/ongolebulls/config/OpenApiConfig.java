package dev.ongolebulls.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ongoleBullsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("OngoleBulls Invest API")
                        .description("Backend APIs for the OngoleBulls Invest fintech platform — including UCC Registration, Auth, Dashboard, KYC, and more.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("OngoleBulls Invest")
                                .url("https://ongolebullsinvest.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Dev")));
    }
}