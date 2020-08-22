package com.satwatovirtusa.parking_lot.service;

import com.satwatovirtusa.parking_lot.model.Users;

import java.util.List;


public interface UserService {
    Users findById(Long id);
    Users findByUsername(String username);
    List<Users> findAll ();
}
