package com.satwatovirtusa.parking_lot.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.satwatovirtusa.parking_lot.model.ParkingLot;

@Repository
public interface ParkingLotRepository extends MongoRepository<ParkingLot, Long>{
    ParkingLot findByGeocode(String geocode);
}