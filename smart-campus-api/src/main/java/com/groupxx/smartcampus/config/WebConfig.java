package com.groupxx.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String projectDir = System.getProperty("user.dir");
        Path uploadPath = Paths.get(projectDir, "uploads");

        String uploadDir = uploadPath.toFile().getAbsolutePath();

        System.out.println("======== FILE CONFIG DEBUG ========");
        System.out.println("Project Dir: " + projectDir);
        System.out.println("Upload Dir: " + uploadDir);
        System.out.println("Uploads folder exists: " + Files.exists(uploadPath));
        System.out.println("==================================");

        String location = "file:" + uploadDir + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}