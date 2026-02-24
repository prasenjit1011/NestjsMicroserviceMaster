package com.example.springlogindashboard.service;

import com.example.springlogindashboard.entity.User;
import com.example.springlogindashboard.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class DataReloadService {
    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void loadDataFromJson() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data.json")) {
            if (inputStream == null) {
                throw new RuntimeException("data.json not found in classpath");
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> data = mapper.readValue(inputStream, new TypeReference<Map<String, Object>>() {});
            List<Map<String, Object>> userMaps = (List<Map<String, Object>>) data.get("users");
            if (userMaps != null) {
                for (Map<String, Object> userMap : userMaps) {
                    User user = new User();
                    user.setId(((Number) userMap.get("id")).longValue());
                    user.setUsername((String) userMap.get("username"));
                    user.setPassword((String) userMap.get("password"));
                    user.setEmail((String) userMap.get("email"));
                    user.setRole((String) userMap.get("role"));
                    user.setEnabled((Boolean) userMap.get("enabled"));
                    userRepository.save(user);
                }
                System.out.println("✅ Users loaded from data.json");
            }
        } catch (Exception e) {
            System.err.println("❌ Error loading users from data.json: " + e.getMessage());
        }
    }

    // Manual reload method for users from data.json
    public void reloadUsersFromJson() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data.json")) {
            if (inputStream == null) {
                throw new RuntimeException("data.json not found in classpath");
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> data = mapper.readValue(inputStream, new TypeReference<Map<String, Object>>() {});
            List<Map<String, Object>> userMaps = (List<Map<String, Object>>) data.get("users");
            if (userMaps != null) {
                userRepository.findAll().forEach(u -> userRepository.deleteById(u.getId()));
                for (Map<String, Object> userMap : userMaps) {
                    User user = new User();
                    user.setId(((Number) userMap.get("id")).longValue());
                    user.setUsername((String) userMap.get("username"));
                    user.setPassword((String) userMap.get("password"));
                    user.setEmail((String) userMap.get("email"));
                    user.setRole((String) userMap.get("role"));
                    user.setEnabled((Boolean) userMap.get("enabled"));
                    userRepository.save(user);
                }
                System.out.println("✅ Users reloaded from data.json");
            }
        } catch (Exception e) {
            System.err.println("❌ Error reloading users from data.json: " + e.getMessage());
        }
    }
}
