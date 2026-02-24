package com.example.springlogindashboard.controller;

import com.example.springlogindashboard.entity.User;
import com.example.springlogindashboard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/users")
public class UserManagementController {
    
    @Autowired
    private UserService userService;
    
    // Get all users (for ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @ResponseBody
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Remove passwords from response for security
        users.forEach(user -> user.setPassword("***"));
        return ResponseEntity.ok(users);
    }
    
    // Get user by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            User foundUser = user.get();
            foundUser.setPassword("***"); // Don't expose password
            return ResponseEntity.ok(foundUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Create new user
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseBody
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            // Check if username or email already exists
            if (userService.existsByUsername(user.getUsername())) {
                return ResponseEntity.badRequest().build();
            }
            if (userService.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().build();
            }
            
            User savedUser = userService.saveUser(user);
            savedUser.setPassword("***"); // Don't expose password in response
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update user
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            Optional<User> existingUser = userService.findById(id);
            if (!existingUser.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            user.setId(id);
            User updatedUser = userService.updateUser(user);
            updatedUser.setPassword("***"); // Don't expose password in response
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
