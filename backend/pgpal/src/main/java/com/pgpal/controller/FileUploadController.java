package com.pgpal.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private final String uploadDir = "C:/Users/Princy/OneDrive/Desktop/pgpal/pgpal/uploads/";

    @PostMapping
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {

        if(file.isEmpty()){
            return "File is empty";
        }

        File folder = new File(uploadDir);
        if(!folder.exists()){
            folder.mkdirs();
        }

        String fileName = file.getOriginalFilename();
        File dest = new File(uploadDir + fileName);

        file.transferTo(dest);

        return "https://semimanagerial-calcanean-avah.ngrok-free.dev/uploads/" + fileName;
    }
}