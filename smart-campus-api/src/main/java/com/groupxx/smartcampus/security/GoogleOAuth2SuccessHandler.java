package com.groupxx.smartcampus.security;

import com.groupxx.smartcampus.dto.auth.AuthResponseDto;
import com.groupxx.smartcampus.exception.AuthException;
import com.groupxx.smartcampus.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private AuthService authService;

    @Value("${app.oauth-frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = getString(attributes, "email");
        String fullName = getString(attributes, "name");
        String firstName = getString(attributes, "given_name");
        String lastName = getString(attributes, "family_name");

        if (email == null || email.isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "OAuth account does not contain an email address");
        }

        AuthResponseDto authResponse = authService.loginWithOAuth(email, fullName, firstName, lastName);

        String redirectUrl = UriComponentsBuilder.fromHttpUrl(frontendUrl)
                .queryParam("token", url(authResponse.getToken()))
                .queryParam("userId", url(authResponse.getUserId()))
                .queryParam("fullName", url(authResponse.getFullName()))
                .queryParam("email", url(authResponse.getEmail()))
                .queryParam("role", url(authResponse.getRole() != null ? authResponse.getRole().name() : ""))
                .queryParam("redirectPath", url(authResponse.getRedirectPath()))
                .build(true)
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private String getString(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value != null ? value.toString() : null;
    }

    private String url(String value) {
        return value == null ? "" : URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
