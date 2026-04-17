package com.groupxx.smartcampus.config;

import com.groupxx.smartcampus.security.BearerTokenAuthenticationFilter;
import com.groupxx.smartcampus.security.RestAccessDeniedHandler;
import com.groupxx.smartcampus.security.RestAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter;

    @Autowired
    private RestAuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    private RestAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**", "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/resources/**", "/bookings/**", "/tickets/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/bookings").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/bookings/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.PATCH, "/bookings/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.DELETE, "/bookings/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.POST, "/resources/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.PUT, "/resources/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.DELETE, "/resources/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers("/analytics/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .anyRequest().permitAll())
                .addFilterBefore(bearerTokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
