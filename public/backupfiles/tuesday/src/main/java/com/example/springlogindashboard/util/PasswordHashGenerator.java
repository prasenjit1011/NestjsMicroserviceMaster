package com.example.springlogindashboard.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        
        System.out.println("admin123 hash: " + passwordEncoder.encode("admin123"));
        System.out.println("password123 hash: " + passwordEncoder.encode("password123"));
        
        // Test the existing hashes
        String existingAdminHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.";
        String existingUserHash = "$2a$10$DowJoayNM.IglqheFH6HMuWd2eaZfFysr9xNQGoEMmJW6PLwHvFHy";
        
        System.out.println("Existing admin hash matches admin123: " + passwordEncoder.matches("admin123", existingAdminHash));
        System.out.println("Existing user hash matches password123: " + passwordEncoder.matches("password123", existingUserHash));
    }
}
