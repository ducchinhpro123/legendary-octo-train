package com.server.ResourceServer.config;

import java.util.List;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class JwtAuthenticationConverter implements Converter<Jwt, CustomAuthentication> {

    private final Logger logger = Logger.getLogger(JwtAuthenticationConverter.class.getName());

    @Override
    public CustomAuthentication convert(Jwt source) {
        List<GrantedAuthority> authorities = List.of(() -> "read and write");
        String priority = String.valueOf(source.getClaims().get("priority"));
        // logger.info("GOT SOMETHING IN CONVERTER");
        return new CustomAuthentication(source, authorities, priority);
    }

}
