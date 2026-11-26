package com.pgpal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgpal.model.RoommateRequest;

public interface RoommateRequestRepository
        extends JpaRepository<RoommateRequest, Long> {

    List<RoommateRequest> findBySenderEmail(
            String senderEmail
    );

    List<RoommateRequest> findByReceiverEmail(
            String receiverEmail
    );

    Optional<RoommateRequest>
    findBySenderEmailAndReceiverEmail(
            String senderEmail,
            String receiverEmail
    );
}