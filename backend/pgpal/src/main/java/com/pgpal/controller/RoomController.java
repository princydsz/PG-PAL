package com.pgpal.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.pgpal.model.Room;
import com.pgpal.service.RoomService;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/add")
    public Room addRoomWithImage(
            @RequestParam("title") String title,
            @RequestParam("location") String location,
            @RequestParam("rent") double rent,
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam("ownerEmail") String ownerEmail,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String uploadDir = "C:/Users/Princy/OneDrive/Desktop/pgpal/pgpal/uploads/";

        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir + fileName);
        file.transferTo(dest);

        Room room = new Room();
        room.setTitle(title);
        room.setLocation(location);
        room.setRent(rent);
        room.setType(type);
        room.setDescription(description);
        room.setOwnerEmail(ownerEmail);
        room.setImageUrl("https://semimanagerial-calcanean-avah.ngrok-free.dev/uploads/" + fileName);

        return roomService.saveRoom(room);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);

        if (room == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }

        return room;
    }

    @GetMapping("/location/{location}")
    public List<Room> getRoomsByLocation(@PathVariable String location) {
        return roomService.getRoomsByLocation(location);
    }

    @GetMapping("/owner/{email}")
    public List<Room> getRoomsByOwner(@PathVariable String email) {
        return roomService.getRoomsByOwner(email);
    }

    @GetMapping("/rent/{rent}")
    public List<Room> getRoomsByRent(@PathVariable double rent) {
        return roomService.getRoomsByMaxRent(rent);
    }

    @GetMapping("/search")
    public List<Room> searchRooms(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) String type
    ) {
        return roomService.searchRooms(location, maxRent, type);
    }

    @DeleteMapping("/{id}")
    public String deleteRoom(
            @PathVariable Long id,
            @RequestParam String ownerEmail
    ) {
        Room room = roomService.getRoomById(id);

        if (room == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }

        if (!room.getOwnerEmail().equals(ownerEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this room");
        }

        roomService.deleteRoom(id);
        return "Room deleted successfully";
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room room) {
        Room existing = roomService.getRoomById(id);

        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }

        if (!existing.getOwnerEmail().equals(room.getOwnerEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to edit this room");
        }

        existing.setTitle(room.getTitle());
        existing.setLocation(room.getLocation());
        existing.setRent(room.getRent());
        existing.setType(room.getType());
        existing.setDescription(room.getDescription());

        return roomService.saveRoom(existing);
    }

    @PutMapping("/update/{id}")
    public Room updateRoomWithImage(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("location") String location,
            @RequestParam("rent") double rent,
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam("ownerEmail") String ownerEmail,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        Room existingRoom = roomService.getRoomById(id);

        if (existingRoom == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }

        if (!existingRoom.getOwnerEmail().equals(ownerEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to edit this room");
        }

        existingRoom.setTitle(title);
        existingRoom.setLocation(location);
        existingRoom.setRent(rent);
        existingRoom.setType(type);
        existingRoom.setDescription(description);

        if (file != null && !file.isEmpty()) {
            String uploadDir = "C:/Users/Princy/OneDrive/Desktop/pgpal/pgpal/uploads/";

            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            file.transferTo(dest);

            existingRoom.setImageUrl("https://semimanagerial-calcanean-avah.ngrok-free.dev/uploads/" + fileName);
        }

        return roomService.saveRoom(existingRoom);
    }

    @GetMapping("/demo")
    public String demo() {
        return "PGPal Backend Running";
    }
}