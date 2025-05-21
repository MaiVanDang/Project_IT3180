package com.example.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

//Used for creating and updating request
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InvoiceRequest {
    @NotNull
    String invoiceId;
    String name;
    String description;
    List<Long> feeIds;
    Long apartmentId;
}