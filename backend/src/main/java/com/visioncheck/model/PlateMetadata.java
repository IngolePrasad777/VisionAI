package com.visioncheck.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "plates")
public class PlateMetadata {

    @Id
    private String id;

    private int plateNumber;
    private String category;       // Green_Dominant, Red_Dominant, Control, Vanishing
    private String imagePath;      // relative path to image file
    private String correctAnswer;  // expected answer for normal vision
    private String cvdAnswer;      // what a CVD person typically sees
}
