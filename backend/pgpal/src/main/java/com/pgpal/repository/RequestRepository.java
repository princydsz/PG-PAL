package com.pgpal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgpal.model.Request;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByLandlordEmail(String email);
    List<Request> findByStudentEmail(String email);
}