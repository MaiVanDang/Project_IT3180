package com.example.dto.response;

import com.example.constant.FeeTypeEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level= AccessLevel.PRIVATE)
public class FeeResponse {
    String name;
    Long id;
    FeeTypeEnum feeType;
    double amount;
}
