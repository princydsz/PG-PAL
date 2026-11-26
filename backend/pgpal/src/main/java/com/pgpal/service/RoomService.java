package com.pgpal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pgpal.model.Room;
import com.pgpal.repository.RoomRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getRoomsByLocation(String location) {
        return roomRepository.findByLocation(location);
    }

    public List<Room> getRoomsByOwner(String email) {
        return roomRepository.findByOwnerEmail(email);
    }

    public List<Room> getRoomsByMaxRent(double rent) {
        return roomRepository.findByRentLessThanEqual(rent);
    }

    
public List<Room> searchRooms(String location, Double maxRent, String type) {
    return roomRepository.searchRooms(location, maxRent, type);
}



public Room getRoomById(Long id) {
    return roomRepository.findById(id)
            .orElse(null);
}

public void deleteRoom(Long id) {
    roomRepository.deleteById(id);
}

public Room updateRoom(Long id, Room updatedRoom) {

    Room existingRoom = roomRepository.findById(id).orElse(null);

    if(existingRoom == null) {
        return null;
    }

    existingRoom.setTitle(updatedRoom.getTitle());
    existingRoom.setLocation(updatedRoom.getLocation());
    existingRoom.setRent(updatedRoom.getRent());
    existingRoom.setType(updatedRoom.getType());
    existingRoom.setOwnerEmail(updatedRoom.getOwnerEmail());
    existingRoom.setDescription(updatedRoom.getDescription());

    return roomRepository.save(existingRoom);
}
}