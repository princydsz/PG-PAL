package com.pgpal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String password;
    private String role; // student / landlord
    private String profilePhoto;

    // student fields
    private String collegeName;
    private String collegeIdPhoto;
    private String idCardPhoto;
    private String preferredLocation;
    private String budget;
    private String preferences;

    // landlord fields
    private String propertyLocation;
    private String electricityBillPhoto;
    private String propertyPhoto;
}