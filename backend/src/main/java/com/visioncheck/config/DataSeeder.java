package com.visioncheck.config;

import com.visioncheck.model.PlateMetadata;
import com.visioncheck.repository.PlateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final PlateRepository plateRepository;

    @Override
    public void run(String... args) {
        if (plateRepository.count() > 0) return; // already seeded

        List<PlateMetadata> plates = new ArrayList<>();

        // Green Dominant plates (1-12)
        for (int i = 1; i <= 12; i++) {
            PlateMetadata p = new PlateMetadata();
            p.setPlateNumber(i);
            p.setCategory("Green_Dominant");
            p.setImagePath("Ishihara Plates/Green Dominant/Plate_" + i + ".png");
            plates.add(p);
        }

        // Red Dominant plates (13-22)
        for (int i = 13; i <= 22; i++) {
            PlateMetadata p = new PlateMetadata();
            p.setPlateNumber(i);
            p.setCategory("Red_Dominant");
            p.setImagePath("Ishihara Plates/Red_Dominant/Plate_" + i + ".png");
            plates.add(p);
        }

        // Control plates (23-26)
        for (int i = 23; i <= 26; i++) {
            PlateMetadata p = new PlateMetadata();
            p.setPlateNumber(i);
            p.setCategory("Control");
            p.setImagePath("Ishihara Plates/Control_/Plate_" + i + ".png");
            plates.add(p);
        }

        // Vanishing plates (27-30)
        for (int i = 27; i <= 30; i++) {
            PlateMetadata p = new PlateMetadata();
            p.setPlateNumber(i);
            p.setCategory("Vanishing");
            p.setImagePath("Ishihara Plates/Vanishing/Plate_" + i + ".png");
            plates.add(p);
        }

        plateRepository.saveAll(plates);
        System.out.println("Seeded " + plates.size() + " Ishihara plates.");
    }
}
