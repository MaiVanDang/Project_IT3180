package org.example.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.example.constant.GenderEnum;
import org.example.constant.ResidentEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "residents")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Resident {
    @Id
    Long id;

    String name;

    LocalDate dob;

    GenderEnum gender;

    String cic;

    @ManyToOne()
    @JoinColumn(name = "addressNumber")
    @JsonIgnore
    Apartment apartment;
    @Enumerated(EnumType.STRING)
    ResidentEnum status;
    int isActive;
    LocalDate statusDate;

    @Transient  // field used to compare with status, not saved into database
    ResidentEnum previousStatus;

    @Transient
    Long apartmentId;

    @PrePersist
    public void beforePersist() {
            isActive = 1;
            statusDate = LocalDate.now();
    }

    @PostLoad
    public void onLoad() {
        this.previousStatus = this.status;
        this.apartmentId = apartment != null ? apartment.getAddressNumber() : null;
    }

    @PreUpdate
    public void beforeUpdate() {
        if (!status.equals(previousStatus)) {  // if status changed
            this.statusDate = LocalDate.now();  // update statusDate
        }
        this.previousStatus = this.status;
        if (this.isActive == 0) {
            this.status = ResidentEnum.Moved; // soft delete
        }
    }

}
