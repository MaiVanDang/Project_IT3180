package com.example.dto.request;

import com.example.constant.GenderEnum;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResidentUpdateRequest {
    Long id;
    String name;
    LocalDate dob;
    GenderEnum gender;
    String cic;
    String status;
    Long addressNumber;
}
