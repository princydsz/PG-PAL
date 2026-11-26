package com.pgpal.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgpal.model.RoommateRequest;
import com.pgpal.repository.RoommateRequestRepository;

@RestController
@RequestMapping("/roommate")
@CrossOrigin(origins = "*")
public class RoommateRequestController {

    @Autowired
    private RoommateRequestRepository repo;

    /* ================= SEND REQUEST ================= */

    @PostMapping("/send")
    public RoommateRequest send(
            @RequestBody RoommateRequest req
    ) {

        // check reverse swipe
        Optional<RoommateRequest> reverseRequest =
                repo.findBySenderEmailAndReceiverEmail(
                        req.getReceiverEmail(),
                        req.getSenderEmail()
                );

        // mutual match found
        if (reverseRequest.isPresent()) {

            RoommateRequest existing =
                    reverseRequest.get();

            existing.setStatus("accepted");

            repo.save(existing);

            req.setStatus("accepted");

            return repo.save(req);
        }

        // first swipe
        req.setStatus("pending");

        return repo.save(req);
    }

    /* ================= GET MY REQUESTS ================= */

    @GetMapping("/my/{email}")
    public List<RoommateRequest> getMyRequests(
            @PathVariable String email
    ) {

        List<RoommateRequest> sent =
                repo.findBySenderEmail(email);

        List<RoommateRequest> received =
                repo.findByReceiverEmail(email);

        List<RoommateRequest> all =
                new ArrayList<>();

        all.addAll(sent);

        all.addAll(received);

        return all;
    }

    /* ================= RECEIVED ================= */

    @GetMapping("/received/{email}")
    public List<RoommateRequest> getReceivedRequests(
            @PathVariable String email
    ) {
        return repo.findByReceiverEmail(email);
    }

    /* ================= ACCEPT ================= */

    @PutMapping("/{id}/accept")
    public RoommateRequest accept(
            @PathVariable Long id
    ) {

        RoommateRequest r =
                repo.findById(id).orElseThrow();

        r.setStatus("accepted");

        return repo.save(r);
    }

    /* ================= REJECT ================= */

    @PutMapping("/{id}/reject")
    public RoommateRequest reject(
            @PathVariable Long id
    ) {

        RoommateRequest r =
                repo.findById(id).orElseThrow();

        r.setStatus("rejected");

        return repo.save(r);
    }
}