package com.server.ResourceServer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class ProjectConfig {
    @Value("${keySetURI}")
    private String keySetUri;

    @Value("${introspectionUri}")
    private String introspectionUri;

    @Value("${resourceserver.clientID}")
    private String resourceServerClientID;

    @Value("${resourceserver.secret}")
    private String resourceServerClientSecret;

    private final JwtAuthenticationConverter converter;
    private final CorsConfigurationSource corsConfigurationSource;

    public ProjectConfig(JwtAuthenticationConverter converter, CorsConfigurationSource corsConfigurationSource) {
        this.converter = converter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configuring the resource server to use JWTs for authentication
        http.oauth2ResourceServer(c -> c.jwt(j -> j.jwkSetUri(keySetUri).jwtAuthenticationConverter(converter)));

        // Enable CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource));

        // The OPTIONS method represents a request for information about the communication 
        // options available on the request/response chain identified by the Request-URI. 
        // This method allows the client to determine the options and/or requirements associated with a resource,
        // or the capabilities of a server, without implying a resource action or initiating a resource retrieval.
        http.authorizeHttpRequests(c -> c.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll());
        http.authorizeHttpRequests(c -> c.anyRequest().authenticated());
        return http.build();
    }
}
