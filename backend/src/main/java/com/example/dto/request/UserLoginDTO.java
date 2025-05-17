package com.example.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level= AccessLevel.PRIVATE)
@Builder
public class UserLoginDTO {
    @NotNull
    long id;

    @NotBlank(message = "email can't be blank")
    String email;

    @NotBlank(message = "password can't be blank")
    String password;
}
