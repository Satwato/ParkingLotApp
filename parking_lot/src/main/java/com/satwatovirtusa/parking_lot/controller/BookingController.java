package com.satwatovirtusa.parking_lot.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.omg.PortableServer.POAPackage.ObjectAlreadyActiveHelper;
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
import org.springframework.http.MediaType;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.satwatovirtusa.parking_lot.exception.BookingExists;
import com.satwatovirtusa.parking_lot.exception.ResourceNotFoundException;
import com.satwatovirtusa.parking_lot.model.Booking;
import com.satwatovirtusa.parking_lot.service.BookingService;
import com.satwatovirtusa.parking_lot.service.impl.BookingServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.satwatovirtusa.parking_lot.repository.BookingRepository;
import com.satwatovirtusa.parking_lot.repository.ParkingLotRepository;
import com.satwatovirtusa.parking_lot.security.auth.MessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;


@RestController 
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping(value="/api", produces = MediaType.APPLICATION_JSON_VALUE )
@PropertySource(value= {"classpath:application.yml"})
public class BookingController {


    @Autowired
	private MongoTemplate mongoTemplate;
    
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingLotRepository parkingLotRepository;
    private RazorpayClient client;
    

    @Value("${razorpay.apikey}")
    private String apiKey;

    @Value("${razorpay.secret}")
    private String secretKey;

  
    // public BookingController(String apiKey, String secretKey) {
    // this.apiKey = apiKey;
    // this.secretKey = secretKey;
    

    // }

    public HashMap<String,String> createPaymentEntity(long st, long en){
        JSONObject options = new JSONObject();
        System.out.println(en);
        System.out.println(st);
        float amount = ((en-st)/60)*100;
        System.out.println(amount);
        //options.put("status", "Available");
        options.put("amount", amount); // Note: The amount should be in paise.
        options.put("currency", "INR");
        
        options.put("payment_capture", 1);
        try {
            Order order = client.Orders.create(options);
            HashMap<String, String> req= new HashMap<>();
            req.put("status", "available");
            req.put("order_id", (String) order.get("id"));
            req.put("amount", String.valueOf(amount));
            System.out.println((String) order.get("id"));
            return req;
        } catch (RazorpayException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            HashMap<String, String> req= new HashMap<>();
            req.put("status", "Cant generate Order");

            return req;
        }
        
        
    }

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


    @GetMapping("/bookings/{username}")
    public ResponseEntity<Booking> getBookingById(@PathVariable(value = "username") Long BookingId)
        throws ResourceNotFoundException {
        Booking Booking = bookingRepository.findById(BookingId)
          .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id :: " + BookingId));
        return ResponseEntity.ok().body(Booking);
    }
    
    @PostMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity <HashMap<String, String>> createBooking(@Valid @RequestBody Booking BookingDetails) throws BookingExists {
        try {
            client = new RazorpayClient(apiKey, secretKey);
        } catch (RazorpayException e) {
            
            e.printStackTrace();
        }
        String u_name= BookingDetails.getUsername();
        System.out.println(BookingDetails.getType()=="test");
        List<JSONObject> entities = new ArrayList<JSONObject>();
            if ((BookingDetails.getType()).equals("test"))
            {
                List<Booking> bk=bookingRepository.findRange(BookingDetails.getGeocode(),BookingDetails.getStarttime(),BookingDetails.getEndtime());
            // System.out.println(BookingDetails.getStarttime().getTime()+" "+BookingDetails.getEndtime().getTime() );
            // String pattern = "yyyy-MM-dd'T'HH:mm:ss.";
            // DateFormat df = new SimpleDateFormat(pattern);
            // String str = df.format(BookingDetails.getStarttime());
            // String en =df.format(BookingDetails.getEndtime());
            // System.out.println("sss "+str+" "+en );
        
                long sl= parkingLotRepository.findByGeocode(BookingDetails.getGeocode()).getSlots();
                if (bk.size()==0){
                   
                    HashMap<String, String> entity= new HashMap<>();
                    entity= createPaymentEntity(BookingDetails.getStarttime(),BookingDetails.getEndtime());
                    //entities.add(entity);
                    //entities.forEach(System.out::println);
                    return new ResponseEntity <HashMap<String, String>>(entity, HttpStatus.OK);
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
                        if(!bookingRepository.existsByUsername(u_name)){

                            HashMap<String, String> entity= new HashMap<>();
                            entity= createPaymentEntity(BookingDetails.getStarttime(),BookingDetails.getEndtime());
                            // entities.add(entity);
                            // entities.forEach(System.out::println);
                            return new ResponseEntity <HashMap<String, String> >(entity, HttpStatus.OK);
                        }
                        else{
                            if ((bookingRepository.findByUsername(u_name, BookingDetails.getStarttime(),BookingDetails.getEndtime())).size()>0){
                            throw new BookingExists("Booking already exists for this user");
                            }
                            else{
                                HashMap<String, String> entity= new HashMap<>();
                            entity= createPaymentEntity(BookingDetails.getStarttime(),BookingDetails.getEndtime());
                            // entities.add(entity);
                            // entities.forEach(System.out::println);
                            return new ResponseEntity <HashMap<String, String> >(entity, HttpStatus.OK);
                            }

                        }

                    }
                }
        }
            else{
                String paymentId = BookingDetails.getPayment_id();
                String razorpaySignature = BookingDetails.getSignature();
                String orderId = BookingDetails.getOrder_id();
                JSONObject options = new JSONObject();

            if (StringUtils.isNotBlank(paymentId) && StringUtils.isNotBlank(razorpaySignature)
                && StringUtils.isNotBlank(orderId)) {
            try {
                options.put("razorpay_payment_id", paymentId);
                options.put("razorpay_order_id", orderId);
                options.put("razorpay_signature", razorpaySignature);
                boolean isEqual = Utils.verifyPaymentSignature(options, this.secretKey);

                if (isEqual) {
                    bookingRepository.save(BookingDetails);
                    HashMap<String, String> entity= new HashMap<>();
                    entity.put("status", "Booked");
                    //entities.add(entity);
                    
                    return new ResponseEntity <HashMap<String, String>>(entity, HttpStatus.OK);
                }
            } catch (RazorpayException e) {
                System.out.println("Exception caused because of " + e.getMessage());
                HashMap<String, String> entity= new HashMap<>();
                entity.put("status", "Failure");
                //entities.add(entity);
                
                return new ResponseEntity <HashMap<String, String>>(entity, HttpStatus.BAD_REQUEST);
            }
            }
            HashMap<String, String> entity= new HashMap<>();
            entity.put("status", "Failure");
            //entities.add(entity);
            
            return new ResponseEntity <HashMap<String, String>>(entity, HttpStatus.BAD_REQUEST);
  
                
            }
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





