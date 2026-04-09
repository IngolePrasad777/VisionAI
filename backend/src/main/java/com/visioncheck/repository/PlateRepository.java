package com.visioncheck.repository;

import com.visioncheck.model.PlateMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PlateRepository extends MongoRepository<PlateMetadata, String> {
    List<PlateMetadata> findAllByOrderByPlateNumberAsc();
    List<PlateMetadata> findByCategory(String category);
    Optional<PlateMetadata> findByPlateNumber(int plateNumber);
}
