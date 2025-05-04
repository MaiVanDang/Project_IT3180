package com.example.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Getter
@Setter
@FieldDefaults(level= AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String name;
    String email;
    String password;
    String authType;

    @Column(columnDefinition = "TEXT")
    String refreshToken;

    String googleAccountId;

    int isActive;

    @PrePersist
    protected void onCreate() {
        this.isActive = 1;
    }
}