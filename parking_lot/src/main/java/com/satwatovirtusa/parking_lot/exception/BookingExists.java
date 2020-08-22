
package com.satwatovirtusa.parking_lot.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class BookingExists  extends Exception{

    private static final long serialVersionUID = 1L;

    public BookingExists (String message){
        super(message);
    }
}