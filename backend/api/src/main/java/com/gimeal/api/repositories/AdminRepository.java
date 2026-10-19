package com.gimeal.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Admin;

public interface AdminRepository 
    extends MongoRepository<Admin, String> {
}
