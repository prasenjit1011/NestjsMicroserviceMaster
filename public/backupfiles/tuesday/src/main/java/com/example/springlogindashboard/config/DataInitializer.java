package com.example.springlogindashboard.config;

import com.example.springlogindashboard.entity.User;
import com.example.springlogindashboard.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public void run(String... args) throws Exception {
        loadUsersFromJson();
    }
    
    private void loadUsersFromJson() {
        try {
            ClassPathResource resource = new ClassPathResource("data.json");
            if (resource.exists()) {
                Map<String, Object> data = objectMapper.readValue(resource.getInputStream(), 
                    new TypeReference<Map<String, Object>>() {});
                
                List<Map<String, Object>> userMaps = (List<Map<String, Object>>) data.get("users");
                
                for (Map<String, Object> userMap : userMaps) {
                    User user = mapToUser(userMap);
                    // Encode the plain text password before saving
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                    userRepository.save(user);
                    System.out.println("✅ Loaded user: " + user.getUsername() + " (" + user.getRole() + ") with plain text password");
                }
                
                System.out.println("==========================================================");
                System.out.println("==========================================================");
                System.out.println("✅ Successfully loaded " + userMaps.size() + " users from data.json");
                System.out.println("📄 Data source: src/main/resources/data.json (plain text passwords)");
                System.out.println("🔧 Data initialization completed - passwords encoded during load");
            } else {
                System.out.println("⚠️ data.json file not found, no users loaded");
            }
        } catch (IOException e) {
            System.err.println("❌ Error loading users from data.json: " + e.getMessage());
        }
    }
    
    private User mapToUser(Map<String, Object> map) {
        User user = new User();
        user.setId(((Number) map.get("id")).longValue());
        user.setUsername((String) map.get("username"));
        user.setPassword((String) map.get("password")); // Plain text password from JSON
        user.setEmail((String) map.get("email"));
        user.setRole((String) map.get("role"));
        user.setEnabled((Boolean) map.get("enabled"));
        return user;
    }
}
