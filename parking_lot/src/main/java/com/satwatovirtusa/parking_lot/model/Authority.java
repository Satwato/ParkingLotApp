package com.satwatovirtusa.parking_lot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "Authority")
public class Authority implements GrantedAuthority {
    /**
     *
     */
    private static final long serialVersionUID = -8020257967427287320L;

    @Id
    private String id;

    private UserRoleName name;




    @Override
    public String getAuthority() {
        return name.name();
    }

    

}