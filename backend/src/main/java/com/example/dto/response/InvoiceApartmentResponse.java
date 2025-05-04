package com.example.dto.response;

import com.example.constant.PaymentEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level= AccessLevel.PRIVATE)
public class InvoiceApartmentResponse {
    String id;
    String name;
    String description;
    Instant updatedAt;
    LocalDate createdAt;
    PaymentEnum paymentStatus;
    List<FeeResponse> feeList;
}
