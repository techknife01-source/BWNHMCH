package com.homeopathy.college.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Homeopathic Medical College Digital Ecosystem API")
                        .description("RESTful microservice API for Academic ERP, IPD Hospital Ward, Digital E-Library, OPD Registry, and CMS Desk.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("BHMCH IT Desk & Software Engineering Division")
                                .email("principal@bwnhmch.com")
                                .url("https://www.bwnhmch.com"))
                        .license(new License().name("Proprietary Medical College License").url("https://www.bwnhmch.com/terms")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
