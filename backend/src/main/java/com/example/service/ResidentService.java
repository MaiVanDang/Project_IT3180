package com.example.service;

import com.example.constant.ResidentEnum;
import com.example.dto.request.ApartmentUpdateRequest;
import com.example.dto.request.ResidentCreateRequest;
import com.example.dto.request.ResidentUpdateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Apartment;
import com.example.entity.Resident;
import com.example.entity.Vehicle;
import com.example.repository.ApartmentRepository;
import com.example.repository.ResidentRepository;
import com.example.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ResidentService {
    private final ResidentRepository residentRepository;
    private final ApartmentRepository apartmentRepository;
    private final VehicleRepository vehicleRepository;

    /**
     * Fetch all active residents with pagination
     */
    public PaginatedResponse<Resident> fetchAllResidents(final Specification<Resident> spec, final Pageable pageable) {
        final var notMovedSpec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.notEqual(root.get("status"), ResidentEnum.Moved);

        final var combinedSpec = spec == null ? notMovedSpec : spec.and(notMovedSpec);
        final var pageResident = this.residentRepository.findAll(combinedSpec, pageable);

        return PaginatedResponse.<Resident>builder()
                .pageSize(pageable.getPageSize())
                .curPage(pageable.getPageNumber())
                .totalPages(pageResident.getTotalPages())
                .totalElements(pageResident.getNumberOfElements())
                .result(pageResident.getContent())
                .build();
    }

    /**
     * Fetch all residents with pagination
     */
    public PaginatedResponse<Resident> fetchAll(final Specification<Resident> spec, final Pageable pageable) {
        final var pageResident = this.residentRepository.findAll(spec, pageable);

        return PaginatedResponse.<Resident>builder()
                .pageSize(pageable.getPageSize())
                .curPage(pageable.getPageNumber() + 1)
                .totalPages(pageResident.getTotalPages())
                .totalElements(pageResident.getNumberOfElements())
                .result(pageResident.getContent())
                .build();
    }

    /**
     * Fetch resident by ID
     */
    @Transactional
    public Resident fetchResidentById(final Long id) {
        return this.residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                    String.format("Resident with id = %d is not found", id)));
    }

    /**
     * Create new resident
     */
    @Transactional
    public Resident createResident(final ResidentCreateRequest request) {
        validateNewResident(request);
        
        final var resident = buildResident(request);
        resident.setIsActive(1);

        try {
            return this.residentRepository.save(resident);
        } catch (Exception e) {
            throw new RuntimeException(String.format("Error saving resident: %s", e.getMessage()));
        }
    }

    /**
     * Update existing resident
     */
    @Transactional
    public Resident updateResident(final ResidentUpdateRequest request) throws Exception {
        final var resident = this.fetchResidentById(request.getId());
        
        if (request.getStatus() != null && request.getStatus().equals("Moved")) {
            return handleResidentMove(resident);
        }

        updateResidentFields(resident, request);
        
        try {
            return residentRepository.save(resident);
        } catch (Exception e) {
            throw new RuntimeException(String.format("Error saving resident: %s", e.getMessage()));
        }
    }

    /**
     * Delete resident
     */
    @Transactional
    public ApiResponse<String> deleteResident(final Long id) throws Exception {
        final var resident = this.fetchResidentById(id);
        
        if (resident.getApartment() == null) {
            residentRepository.deleteById(id);
        } else {
            handleResidentDeletion(resident);
        }

        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("Deleted resident successfully")
                .data(null)
                .build();
    }

    // Private helper methods
    private void validateNewResident(final ResidentCreateRequest request) {
        if (this.residentRepository.findById(Long.parseLong(request.getCic())).isPresent()) {
            throw new RuntimeException(String.format("Resident with id = %s already exists", request.getCic()));
        }
    }

    private Resident buildResident(final ResidentCreateRequest request) {
        final var builder = Resident.builder()
                .id(Long.parseLong(request.getCic()))
                .name(request.getName())
                .dob(request.getDob())
                .gender(request.getGender())
                .cic(request.getCic())
                .status(ResidentEnum.fromString(request.getStatus()));

        if (request.getApartmentId() != 0) {
            final var apartment = findAndValidateApartment(request.getApartmentId());
            builder.apartment(apartment);
            
            final var residentList = apartment.getResidentList();
            final var resident = builder.build();
            
            resident.setApartmentId(apartment.getAddressNumber());
            residentList.add(resident);
            apartment.setResidentList(residentList);
            apartmentRepository.save(apartment);
            
            return resident;
        }

        return builder.apartment(null).build();
    }

    private Apartment findAndValidateApartment(final Long apartmentId) {
        return this.apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException(
                    String.format("Apartment with id = %d does not exist", apartmentId)));
    }

    private Resident handleResidentMove(final Resident resident) {
        final var apartment = apartmentRepository.findByOwner_Id(resident.getId()).orElse(null);

        if (apartment != null) {
            handleOwnerMove(apartment);
        } else {
            resident.setIsActive(0);
            resident.setStatus(ResidentEnum.Moved);
            resident.setApartment(null);
            residentRepository.save(resident);
        }
        
        return null;
    }

    private void handleOwnerMove(final Apartment apartment) {
        apartment.setOwner(null);
        apartment.setOwnerPhone(null);
        apartmentRepository.save(apartment);

        final var residentList = apartment.getResidentList();
        for (final var resident : residentList) {
            resident.setApartment(null);
            resident.setIsActive(0);
            resident.setStatus(ResidentEnum.Moved);
            residentRepository.save(resident);
        }
    }

    private void handleResidentDeletion(final Resident resident) {
        final var apartment = resident.getApartment();
        final var ownedApartment = apartmentRepository.findByOwner_Id(resident.getId()).orElse(null);

        if (ownedApartment != null) {
            handleOwnerDeletion(ownedApartment, apartment);
        } else {
            handleMemberDeletion(resident, apartment);
        }
    }

    private void handleOwnerDeletion(final Apartment ownedApartment, final Apartment apartment) {
        ownedApartment.setOwner(null);
        ownedApartment.setOwnerPhone(null);
        apartmentRepository.save(ownedApartment);

        deleteApartmentVehicles(apartment);

        final var allResidents = apartment.getResidentList();
        disconnectAndDeleteResidents(allResidents);
    }

    private void deleteApartmentVehicles(final Apartment apartment) {
        final var vehicles = apartment.getVehicleList();
        if (vehicles != null && !vehicles.isEmpty()) {
            vehicles.forEach(vehicle -> vehicleRepository.deleteById(vehicle.getId()));
            apartment.setVehicleList(Collections.emptyList());
            apartmentRepository.save(apartment);
        }
    }

    private void disconnectAndDeleteResidents(final List<Resident> residents) {
        residents.forEach(resident -> {
            resident.setApartment(null);
            residentRepository.save(resident);
        });

        residents.forEach(resident -> residentRepository.delete(resident.getId()));
    }

    private void handleMemberDeletion(final Resident resident, final Apartment apartment) {
        final var residentList = apartment.getResidentList();
        residentList.removeIf(r -> r.getId().equals(resident.getId()));
        apartment.setResidentList(residentList);
        apartmentRepository.save(apartment);

        resident.setApartment(null);
        residentRepository.save(resident);
        residentRepository.deleteById(resident.getId());
    }

    private void updateResidentFields(final Resident resident, final ResidentUpdateRequest request) {
        Optional.ofNullable(request.getName()).ifPresent(resident::setName);
        Optional.ofNullable(request.getDob()).ifPresent(resident::setDob);
        Optional.ofNullable(request.getStatus())
                .ifPresent(status -> resident.setStatus(ResidentEnum.fromString(status)));
        Optional.ofNullable(request.getGender()).ifPresent(resident::setGender);
        Optional.ofNullable(request.getCic()).ifPresent(resident::setCic);
        
        resident.setIsActive(1);

        if (request.getAddressNumber() != null) {
            updateResidentApartment(resident, request.getAddressNumber());
        }
    }

    private void updateResidentApartment(final Resident resident, final Long addressNumber) {
        final var newApartment = this.apartmentRepository.findById(addressNumber)
                .orElseThrow(() -> new RuntimeException(
                    String.format("Apartment with address number %d not found", addressNumber)));

        final var residentList = newApartment.getResidentList();
        residentList.add(resident);
        newApartment.setResidentList(residentList);
        apartmentRepository.save(newApartment);
        resident.setApartment(newApartment);
    }
}