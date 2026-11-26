package com.pgpal.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
