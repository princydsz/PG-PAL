package com.pgpal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pgpal.model.Review;
import com.pgpal.repository.ReviewRepository;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {

        if (review.getReviewType() == null
                || review.getReviewType().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Review type is required");
        }

        if (review.getReviewerEmail() == null
                || review.getReviewerEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Reviewer email is required");
        }

        if (review.getRating() < 1
                || review.getRating() > 5) {

            return ResponseEntity.badRequest()
                    .body("Rating must be between 1 and 5");
        }

        if (review.getComment() == null
                || review.getComment().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Comment is required");
        }

        String type =
                review.getReviewType()
                        .trim()
                        .toLowerCase();

        /* ================= ROOM REVIEW ================= */

        if (type.equals("room")) {

            if (review.getRoomId() == null) {

                return ResponseEntity.badRequest()
                        .body("Room ID is required");
            }

            boolean alreadyReviewed =
                    reviewRepository
                            .existsByReviewerEmailAndRoomId(
                                    review.getReviewerEmail().trim(),
                                    review.getRoomId()
                            );

            if (alreadyReviewed) {

                return ResponseEntity.badRequest()
                        .body("You already reviewed this room");
            }
        }

        /* ================= ROOMMATE REVIEW ================= */

        else if (type.equals("roommate")) {

            if (review.getReviewedEmail() == null
                    || review.getReviewedEmail().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Reviewed email is required");
            }

            boolean alreadyReviewed =
                    reviewRepository
                            .existsByReviewerEmailAndReviewedEmail(
                                    review.getReviewerEmail().trim(),
                                    review.getReviewedEmail().trim()
                            );

            if (alreadyReviewed) {

                return ResponseEntity.badRequest()
                        .body("You already reviewed this roommate");
            }
        }

        else {

            return ResponseEntity.badRequest()
                    .body("Invalid review type");
        }

        review.setReviewType(type);

        review.setReviewerEmail(
                review.getReviewerEmail().trim()
        );

        review.setComment(
                review.getComment().trim()
        );

        if (review.getReviewedEmail() != null) {

            review.setReviewedEmail(
                    review.getReviewedEmail().trim()
            );
        }

        return ResponseEntity.ok(
                reviewRepository.save(review)
        );
    }

    /* ================= ROOM REVIEWS ================= */

    @GetMapping("/room/{roomId}")
    public List<Review> getRoomReviews(
            @PathVariable Long roomId
    ) {
        return reviewRepository.findByRoomId(roomId);
    }

    /* ================= ROOMMATE REVIEWS ================= */

    @GetMapping("/roommate/{email}")
    public List<Review> getRoommateReviews(
            @PathVariable String email
    ) {
        return reviewRepository.findByReviewedEmail(email);
    }

    /* ================= DELETE REVIEW ================= */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long id
    ) {

        if (!reviewRepository.existsById(id)) {

            return ResponseEntity.badRequest()
                    .body("Review not found");
        }

        reviewRepository.deleteById(id);

        return ResponseEntity.ok(
                "Review deleted successfully"
        );
    }
}