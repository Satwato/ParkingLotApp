package com.satwatovirtusa.parking_lot.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

import com.satwatovirtusa.parking_lot.model.Booking;
import com.satwatovirtusa.parking_lot.service.BookingService;

@Repository
public interface BookingRepository extends MongoRepository<Booking, Long>,BookingService{
    Boolean existsByUsername(String username);
    List<Booking> findRange(long geocode,long st,long en);
}