package com.example.service;

import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Apartment;
import com.example.entity.Vehicle;
import com.example.repository.ApartmentRepository;
import com.example.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final ApartmentRepository apartmentRepository;

    /**
     * Find all vehicles by apartment ID
     */
    @Transactional(readOnly = true)
    public List<Vehicle> findAllByApartmentId(final long apartmentId) {
        if (!this.apartmentRepository.existsById(apartmentId)) {
            throw new RuntimeException(String.format("Apartment with id %d does not exist", apartmentId));
        }
        return this.vehicleRepository.findAllByApartment_AddressNumber(apartmentId);
    }

    /**
     * Get all vehicles with pagination
     */
    @Transactional(readOnly = true)
    public PaginatedResponse<Vehicle> getAll(final Specification<Vehicle> spec, final Pageable pageable) {
        final var pageVehicle = vehicleRepository.findAll(spec, pageable);
        
        return PaginatedResponse.<Vehicle>builder()
                .pageSize(pageable.getPageSize())
                .curPage(pageable.getPageNumber())
                .totalPages(pageVehicle.getTotalPages())
                .totalElements(pageVehicle.getNumberOfElements())
                .result(pageVehicle.getContent())
                .build();
    }

    /**
     * Create new vehicle
     */
    @Transactional
    public Vehicle create(final Vehicle vehicleRequest) {
        validateVehicleRequest(vehicleRequest);
        
        final var apartment = findAndValidateApartment(vehicleRequest.getApartmentId());
        validateApartmentOwner(apartment);
        
        final var vehicle = Vehicle.builder()
                .id(vehicleRequest.getId())
                .category(vehicleRequest.getCategory())
                .apartment(apartment)
                .build();
                
        return this.vehicleRepository.save(vehicle);
    }

    /**
     * Delete vehicle
     */
    @Transactional
    public ApiResponse<String> deleteVehicle(final Long id, final Vehicle vehicleRequest) {
        final var apartment = this.apartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(String.format("Apartment with id %d does not exist", id)));
                
        final var vehicle = this.vehicleRepository.findById(vehicleRequest.getId())
                .orElseThrow(() -> new RuntimeException(String.format("Vehicle with id %s not found", vehicleRequest.getId())));

        final var vehicleList = apartment.getVehicleList();
        vehicleList.remove(vehicle);
        apartment.setVehicleList(vehicleList);
        
        this.apartmentRepository.saveAndFlush(apartment);
        this.vehicleRepository.delete(vehicle);
        
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .message("delete vehicle success")
                .data(null)
                .build();
    }

    // Private helper methods
    private void validateVehicleRequest(final Vehicle vehicleRequest) {
        if (vehicleRequest.getId() == null) {
            throw new RuntimeException("Vehicle id is null");
        }
        
        if (this.vehicleRepository.findById(vehicleRequest.getId()).isPresent()) {
            throw new RuntimeException(String.format("Vehicle with id = %s already exists", vehicleRequest.getId()));
        }
    }

    private Apartment findAndValidateApartment(final Long apartmentId) {
        return this.apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException(
                    String.format("Apartment with id %d does not exist", apartmentId)));
    }

    private void validateApartmentOwner(final Apartment apartment) {
        if (apartment.getOwner() == null) {
            throw new RuntimeException(String.format(
                "Apartment with id %d doesn't have an owner yet. Please assign an owner before registering vehicles.",
                apartment.getId()));
        }
    }
}