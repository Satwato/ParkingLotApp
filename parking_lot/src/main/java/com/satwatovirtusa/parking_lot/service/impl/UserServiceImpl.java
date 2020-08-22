package com.satwatovirtusa.parking_lot.service.impl;

import com.satwatovirtusa.parking_lot.model.Users;
import com.satwatovirtusa.parking_lot.repository.UserRepository;
import com.satwatovirtusa.parking_lot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by fan.jin on 2016-10-15.
 */

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Users findByUsername( String username ) throws UsernameNotFoundException {
        Users u = userRepository.findByUsername( username );
        return u;
    }

    public Users findById( Long id ) throws AccessDeniedException {
        Users u = userRepository.findById( id ).get();
        return u;
    }

    public List<Users> findAll() throws AccessDeniedException {
        List<Users> result = userRepository.findAll();
        return result;
    }
}
