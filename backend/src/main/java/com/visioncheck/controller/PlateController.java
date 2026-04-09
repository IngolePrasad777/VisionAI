package com.visioncheck.controller;

import com.visioncheck.model.PlateMetadata;
import com.visioncheck.repository.PlateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/plates")
@RequiredArgsConstructor
public class PlateController {

    private final PlateRepository plateRepository;

    @Value("${plates.base-path:../}")
    private String platesBasePath;

    // Returns metadata for all plates (ordered)
    @GetMapping
    public List<PlateMetadata> getAllPlates() {
        return plateRepository.findAllByOrderByPlateNumberAsc();
    }

    // Serves the actual plate image
    @GetMapping("/image/{plateNumber}")
    public ResponseEntity<Resource> getPlateImage(@PathVariable int plateNumber) {
        return plateRepository.findByPlateNumber(plateNumber)
                .map(p -> {
                    File file = Paths.get(platesBasePath, p.getImagePath()).toFile();
                    if (!file.exists()) return ResponseEntity.notFound().<Resource>build();
                    Resource resource = new FileSystemResource(file);
                    return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(resource);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
