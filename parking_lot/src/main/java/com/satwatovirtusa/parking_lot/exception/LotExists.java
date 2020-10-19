
package com.satwatovirtusa.parking_lot.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class LotExists  extends Exception{

    private static final long serialVersionUID = 1L;

    public LotExists (String message){
        super(message);
    }
}