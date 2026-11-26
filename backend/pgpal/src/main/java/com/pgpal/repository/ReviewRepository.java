package com.pgpal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pgpal.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRoomId(Long roomId);

    boolean existsByReviewerEmailAndRoomId(
        String reviewerEmail,
        Long roomId
    );

    List<Review> findByReviewerEmail(String reviewerEmail);

    List<Review> findByReviewedEmail(String reviewedEmail);

    boolean existsByReviewerEmailAndReviewedEmail(
        String reviewerEmail,
        String reviewedEmail
    );
}