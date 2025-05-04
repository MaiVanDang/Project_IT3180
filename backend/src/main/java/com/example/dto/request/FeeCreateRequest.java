package com.example.dto.request;

import com.example.constant.FeeTypeEnum;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeCreateRequest {
    String name;
    String description;
    FeeTypeEnum feeTypeEnum;
    BigDecimal unitPrice;
}
