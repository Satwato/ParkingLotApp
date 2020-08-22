package com.satwatovirtusa.parking_lot.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.satwatovirtusa.parking_lot.model.Authority;
import com.satwatovirtusa.parking_lot.model.UserRoleName;

public interface AuthorityRepository extends MongoRepository<Authority, String> {
  Authority findByName(UserRoleName name);
}

