package com.server.ResourceServer.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class DemoController {
    
    @GetMapping("/demo")
    public String demo() {
        return "Demo from Resource Server";
    }
    
    @GetMapping("/user-info")
    public Map<String, Object> getUserInfo(Authentication authentication) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", authentication.getName());
        userInfo.put("authorities", authentication.getAuthorities());
        userInfo.put("message", "Hello from Resource Server!");
        return userInfo;
    }
    
    @GetMapping("/protected")
    public Map<String, Object> getProtectedResource(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is a protected resource");
        response.put("user", authentication.getName());
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}

