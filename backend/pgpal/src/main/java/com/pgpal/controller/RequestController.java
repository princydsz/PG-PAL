package com.pgpal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pgpal.model.Request;
import com.pgpal.repository.RequestRepository;

@RestController
@RequestMapping("/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestRepository repo;

    // SEND REQUEST
    @PostMapping("/send")
    public Request sendRequest(@RequestBody Request req) {
        req.setStatus("pending");
        return repo.save(req);
    }

    // LANDLORD VIEW REQUESTS
    @GetMapping("/landlord/{email}")
    public List<Request> getLandlordRequests(@PathVariable String email) {
        return repo.findByLandlordEmail(email);
    }

    // STUDENT VIEW REQUESTS  ✅ FIXED
    @GetMapping("/student/{email}")
    public List<Request> getStudentRequests(@PathVariable String email) {
        return repo.findByStudentEmail(email);
    }

    // ACCEPT
    @PutMapping("/{id}/accept")
    public Request accept(@PathVariable Long id) {
        Request r = repo.findById(id).orElseThrow();
        r.setStatus("accepted");
        return repo.save(r);
    }

    // REJECT
    @PutMapping("/{id}/reject")
    public Request reject(@PathVariable Long id) {
        Request r = repo.findById(id).orElseThrow();
        r.setStatus("rejected");
        return repo.save(r);
    }
    @GetMapping("/details/{id}")
public Request getRequestById(@PathVariable Long id) {
    return repo.findById(id).orElseThrow();
}
}