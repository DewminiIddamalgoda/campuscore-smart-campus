package com.groupxx.smartcampus.security;

import com.groupxx.smartcampus.entity.AppUser;
import com.groupxx.smartcampus.entity.AuthSession;
import com.groupxx.smartcampus.repository.AppUserRepository;
import com.groupxx.smartcampus.repository.AuthSessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class BearerTokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private AuthSessionRepository authSessionRepository;

    @Autowired
    private AppUserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            authSessionRepository.findByToken(token).ifPresent(session -> authenticateSession(session, request));
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateSession(AuthSession session, HttpServletRequest request) {
        if (session.isRevoked() || session.getExpiresAt().isBefore(LocalDateTime.now())) {
            return;
        }

        AppUser user = userRepository.findByEmailIgnoreCase(session.getEmail()).orElse(null);
        if (user == null || !user.isActive()) {
            return;
        }

        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + session.getRole().name())
        );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
