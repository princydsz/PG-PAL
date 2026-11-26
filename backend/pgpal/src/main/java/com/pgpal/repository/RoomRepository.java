package com.pgpal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pgpal.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByLocation(String location);

    List<Room> findByOwnerEmail(String ownerEmail);

    List<Room> findByRentLessThanEqual(double rent);

  @Query("SELECT r FROM Room r WHERE " +
       "(:location IS NULL OR r.location = :location) AND " +
       "(:maxRent IS NULL OR r.rent <= :maxRent) AND " +
       "(:type IS NULL OR r.type = :type)")
List<Room> searchRooms(
        @org.springframework.data.repository.query.Param("location") String location,
        @org.springframework.data.repository.query.Param("maxRent") Double maxRent,
        @org.springframework.data.repository.query.Param("type") String type
);
}
