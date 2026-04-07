package dev.ongolebulls.config;

import dev.ongolebulls.security.JwtAuthenticationFilter;
import dev.ongolebulls.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/auth/**",
                                "/api/auth/**",
                                "/api/auth/login",
                                "/api/auth/send-email-otp",
                                "/api/auth/verify-email-otp",
                                "/api/auth/register-client",
                                "/api/auth/forgot-password",
                                "/api/auth/referrer-info",
                                "/api/login",
                                "/api/admin/login",
                                "/api/contact",
                                "/api/subscribers/**",
                                // Website Controls CMS endpoints (non-JWT auth)
                                "/api/kpi",
                                "/api/charts/**",
                                "/api/leaderboard",
                                "/api/alerts",
                                "/api/services/**",
                                "/api/service-sections/**",
                                "/api/section-items/**",
                                "/api/clients",
                                "/api/reports/**",
                                "/api/blogs/**",
                                "/api/documents/**",
                                "/api/jobs/**",
                                "/api/candidates/**",
                                "/api/funds/**",
                                "/api/appointments/**",
                                "/api/seo/**",
                                "/api/plans/**",
                                "/otp/**",
                                "/password-reset/**",
                                "/reset-password/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/assets/**",
                                "/static/**",
                                "/*.css",
                                "/*.js",
                                "/*.png",
                                "/*.jpg",
                                "/*.svg",
                                "/favicon.ico"
                        ).permitAll()
                        // Role-based access rules for dashboard APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/partner/**").hasAnyRole("INDIVIDUAL_PARTNER", "NON_INDIVIDUAL_PARTNER")
                        .requestMatchers("/api/rm/**").hasRole("RELATIONSHIP_MANAGER")
                        .requestMatchers("/api/operations/**").hasRole("OPERATIONS")
                        .requestMatchers("/api/compliance/**").hasRole("COMPLIANCE")
                        .requestMatchers("/api/finance/**").hasRole("FINANCE")
                        .requestMatchers("/api/support/**").hasRole("SUPPORT")
                        .requestMatchers("/api/bse/**").authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .authenticationProvider(authenticationProvider())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                new AntPathRequestMatcher("/api/auth/login"),
                                new AntPathRequestMatcher("/api/auth/send-email-otp"),
                                new AntPathRequestMatcher("/api/auth/verify-email-otp"),
                                new AntPathRequestMatcher("/api/auth/register-client"),
                                new AntPathRequestMatcher("/api/auth/forgot-password"),
                                new AntPathRequestMatcher("/api/login"),
                                new AntPathRequestMatcher("/api/contact")
                        )
                        .disable()
                );

        return http.build();
    }
}