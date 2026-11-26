package com.pgpal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pgpal.model.User;
import com.pgpal.repository.UserRepository;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        // Name validation
        if (user.getName() == null || !user.getName().trim().matches("^[A-Za-z ]{2,50}$")) {
            return ResponseEntity.badRequest().body("Invalid name");
        }

        // Phone validation
        if (user.getPhone() == null || !user.getPhone().trim().matches("^[0-9]{10}$")) {
            return ResponseEntity.badRequest().body("Phone must be 10 digits");
        }

        // Email validation
        if (user.getEmail() == null || !user.getEmail().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        // Password validation
        if (user.getPassword() == null || user.getPassword().trim().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }

        // Role validation
        if (user.getRole() == null ||
                (!user.getRole().equals("student") && !user.getRole().equals("landlord"))) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        // Check email already exists
        if (userRepository.findByEmail(user.getEmail().trim()) != null) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // Trim values
        user.setName(user.getName().trim());
        user.setPhone(user.getPhone().trim());
        user.setEmail(user.getEmail().trim());
        user.setPassword(user.getPassword().trim());
        user.setRole(user.getRole().trim());

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email or Password missing");
        }

        User existingUser = userRepository.findByEmail(user.getEmail().trim());

        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (!existingUser.getPassword().equals(user.getPassword().trim())) {
            return ResponseEntity.status(401).body("Wrong password");
        }

        return ResponseEntity.ok(existingUser);
    }

    // ================= UPDATE PROFILE =================
    @PutMapping("/update/{email}")
    public ResponseEntity<?> updateUser(
            @PathVariable String email,
            @RequestBody User updatedUser) {

        User existingUser = userRepository.findByEmail(email);

        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Validation
        if (!updatedUser.getName().trim().matches("^[A-Za-z ]{2,50}$")) {
            return ResponseEntity.badRequest().body("Invalid name");
        }

        if (!updatedUser.getPhone().trim().matches("^[0-9]{10}$")) {
            return ResponseEntity.badRequest().body("Phone must be 10 digits");
        }

        // Update fields
        existingUser.setName(updatedUser.getName().trim());
        existingUser.setPhone(updatedUser.getPhone().trim());
        existingUser.setProfilePhoto(updatedUser.getProfilePhoto());

        existingUser.setCollegeName(updatedUser.getCollegeName());
        existingUser.setPreferredLocation(updatedUser.getPreferredLocation());
        existingUser.setBudget(updatedUser.getBudget());
        existingUser.setPreferences(updatedUser.getPreferences());

        existingUser.setPropertyLocation(updatedUser.getPropertyLocation());
        existingUser.setPropertyPhoto(updatedUser.getPropertyPhoto());

        return ResponseEntity.ok(userRepository.save(existingUser));
    }

    // ================= GET USER =================
    @GetMapping("/{email}")
    public ResponseEntity<?> getUser(@PathVariable String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // ================= GET STUDENTS =================
    @GetMapping("/students")
    public List<User> getStudents() {
        return userRepository.findByRole("student");
    }

    // ================= GET LANDLORDS =================
    @GetMapping("/landlords")
    public List<User> getLandlords() {
        return userRepository.findByRole("landlord");
    }

    // ================= GET ALL USERS =================
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {

        User user = userRepository.findByEmail(email.trim());

        if (user == null) {
            return ResponseEntity.status(404).body("No account found");
        }

        return ResponseEntity.ok("Reset link sent (demo)");
    }
}