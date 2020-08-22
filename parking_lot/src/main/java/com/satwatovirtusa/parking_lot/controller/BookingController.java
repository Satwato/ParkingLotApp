package com.satwatovirtusa.parking_lot.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.satwatovirtusa.parking_lot.exception.BookingExists;
import com.satwatovirtusa.parking_lot.exception.ResourceNotFoundException;
import com.satwatovirtusa.parking_lot.model.Booking;
import com.satwatovirtusa.parking_lot.service.BookingService;
import com.satwatovirtusa.parking_lot.service.impl.BookingImpl;
import com.satwatovirtusa.parking_lot.repository.BookingRepository;
import com.satwatovirtusa.parking_lot.repository.ParkingLotRepository;
import com.satwatovirtusa.parking_lot.security.auth.MessageResponse;

@RestController @CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1")

public class BookingController {

    @Autowired
	private MongoTemplate mongoTemplate;
    
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingLotRepository parkingLotRepository;

    public static int maxOverlapIntervalCount(List<Long> start, List<Long> end) {
        int maxOverlap = 0;
        int currentOverlap = 0;
        
        Collections.sort(start);
        Collections.sort(end);
        
        int i = 0;
        int j = 0;
        int m=start.size(),n=end.size();
        while(i< m && j < n){
            if(start.get(i) < end.get(j)){
                currentOverlap++;
                maxOverlap = Math.max(maxOverlap, currentOverlap);
                i++;
            }
            else{
                currentOverlap--;
                j++;
            }
        }
        System.out.println(maxOverlap);
        return maxOverlap;
    }


    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable(value = "id") Long BookingId)
        throws ResourceNotFoundException {
        Booking Booking = bookingRepository.findById(BookingId)
          .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id :: " + BookingId));
        return ResponseEntity.ok().body(Booking);
    }
    
    @PostMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public Booking createBooking(@Valid @RequestBody Booking BookingDetails) throws BookingExists {
        String u_name= BookingDetails.getUsername();
        
        if(!bookingRepository.existsByUsername(u_name)){
            List<Booking> bk=bookingRepository.findRange(BookingDetails.getGeocode(),BookingDetails.getStarttime(),BookingDetails.getEndtime());
            // System.out.println(BookingDetails.getStarttime().getTime()+" "+BookingDetails.getEndtime().getTime() );
            // String pattern = "yyyy-MM-dd'T'HH:mm:ss.";
            // DateFormat df = new SimpleDateFormat(pattern);
            // String str = df.format(BookingDetails.getStarttime());
            // String en =df.format(BookingDetails.getEndtime());
            // System.out.println("sss "+str+" "+en );
        
            long sl= parkingLotRepository.findByGeocode(BookingDetails.getGeocode()).getSlots();
            if (bk.size()==0){
                return bookingRepository.save(BookingDetails);
            }
            else{
                List<Long> start = bk.stream().map((b) -> b.getStarttime()).collect(Collectors.toList());
                List<Long> end = bk.stream().map((b) -> b.getEndtime()).collect(Collectors.toList());
                start.forEach(System.out::println);
                end.forEach(System.out::println);
                if (maxOverlapIntervalCount(start, end)>=sl){
                    throw new BookingExists("All slots are full. Please try again later");
                }
                else{
                    return bookingRepository.save(BookingDetails);
                }
            }
        }
        else{
            throw new BookingExists("Booking already exists for this user");
        }
        

        
    }

    // @PutMapping("/lots/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<Booking> updateBooking(@PathVariable(value = "id") Long BookingId,
    //      @Valid @RequestBody Booking BookingDetails) throws ResourceNotFoundException {
    //     Booking Booking = bookingRepository.findById(BookingId)
    //     .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id :: " + BookingId));

    //     Booking.setAddress(BookingDetails.getAddress());
    //     Booking.setSlots(BookingDetails.getSlots());
    //     Booking.setPin(BookingDetails.getPin());
    //     Booking.setGeocode(BookingDetails.getGeocode());
    //     final Booking updatedBooking = bookingRepository.save(Booking);
    //     return ResponseEntity.ok(updatedBooking);
    // }

    // @DeleteMapping("/lots/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    // public Map<String, Boolean> deleteBooking(@PathVariable(value = "id") Long BookingId)
    //      throws ResourceNotFoundException {
    //     Booking Booking = bookingRepository.findById(BookingId)
    //    .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id :: " + BookingId));

    //     bookingRepository.delete(Booking);
    //     Map<String, Boolean> response = new HashMap<>();
    //     response.put("deleted", Boolean.TRUE);
    //     return response;
    // }
}




