package com.example.exception;

import lombok.AllArgsConstructor;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ErrorResponse {
    LocalDateTime timestamp;
    int status;
    String error;
    String message;
    String path;
}