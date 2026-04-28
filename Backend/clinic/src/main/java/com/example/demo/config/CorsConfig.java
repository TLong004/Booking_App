package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Cho phép tất cả các API
                        .allowedOriginPatterns("*") // Cho phép tất cả các domain (kể cả Flutter, React)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các HTTP method được phép
                        .allowedHeaders("*") // Cho phép tất cả các header
                        .allowCredentials(true); // Cho phép gửi cookie/token
            }
        };
    }
}