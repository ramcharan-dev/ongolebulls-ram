package dev.ongolebulls.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/signup", "/api/auth/login", "/api/contact","/api/subscribers/**").permitAll() // Allow these endpoints
                        .requestMatchers("/**").permitAll() // Allow all static resources (HTML, CSS, JS, images)
                        .anyRequest().authenticated() // Require authentication for other requests
                )
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> {}) // Enable Basic Authentication for APIs
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                new AntPathRequestMatcher("/api/auth/signup"),
                                new AntPathRequestMatcher("/api/auth/login"),
                                new AntPathRequestMatcher("/api/contact")

                        )
                        .disable() // Disable CSRF for static resources if needed
                );

        return http.build();
    }
}