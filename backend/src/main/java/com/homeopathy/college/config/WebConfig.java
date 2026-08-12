package com.homeopathy.college.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/documents/**", "/api/v1/documents/**")
                .addResourceLocations("classpath:/public/documents/", "file:public/documents/", "file:src/main/resources/public/documents/");
        registry.addResourceHandler("/downloads/**", "/api/v1/downloads/**")
                .addResourceLocations("classpath:/public/downloads/", "file:public/downloads/", "file:src/main/resources/public/downloads/");
    }
}
