package com.satwatovirtusa.parking_lot.service;

import java.util.Date;

import java.util.List;

import com.satwatovirtusa.parking_lot.model.Booking;
//import com.satwatovirtusa.parking_lot.repository.BookingRepository;



public interface BookingService {
    

   
    
    public List<Booking> findRange(String geocode, long st, long en) ;
    public List<Booking> findByUsername(String username , long st, long en) ;
    
    

    
}