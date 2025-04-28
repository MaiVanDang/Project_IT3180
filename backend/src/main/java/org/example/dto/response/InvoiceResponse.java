package org.example.dto.response;

import org.example.entity.Fee;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level= AccessLevel.PRIVATE)
public class InvoiceResponse {
    int isActive;
    String id;
    String name;
    String description;
    LocalDate lastUpdated;
    List<Fee> feeList;
}


