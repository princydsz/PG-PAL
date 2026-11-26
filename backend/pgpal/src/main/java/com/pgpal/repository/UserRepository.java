package com.pgpal.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pgpal.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    List<User> findByRole(String role);
}