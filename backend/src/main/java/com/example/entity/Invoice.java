package com.example.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invoice {
    @Id
    String id;
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @JsonIgnore  //hide this field
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)  //cascade: used for auto updating at fees and invoices table
    List<FeeInvoice> feeInvoices;

    @JsonIgnore  //hide this field
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)  //cascade: used for auto updating at fees and invoices table
    List<InvoiceApartment> invoiceApartments;

    int isActive;
    Instant updatedAt;
    LocalDate createdAt;

    @PrePersist
    public void beforeCreate() {
        this.isActive = 1;
        this.updatedAt = Instant.now();
        this.createdAt = LocalDate.now();
    }

    @PreUpdate
    public void beforeUpdate() {
        this.updatedAt = Instant.now();
    }
}