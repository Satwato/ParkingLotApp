package com.satwatovirtusa.parking_lot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotEmpty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "lots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ParkingLot {
    @Id
    private String id;

    @NotEmpty
    private String geocode;
    @NotEmpty
    private String address;
    @NotEmpty
    private long slots;
    @NotEmpty
    private float lat;
    @NotEmpty
    private float lng;
 

    
    @Override
    public String toString() {
        return "Employee [id=" + id + ", Geocode=" + geocode + ", Address=" + address + ", Slots" + slots 
       + "]";
    }
 
}