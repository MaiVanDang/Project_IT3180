package com.example.service;

import com.example.constant.ResidentEnum;
import com.example.dto.request.ApartmentUpdateRequest;
import com.example.dto.request.ResidentCreateRequest;
import com.example.dto.request.ResidentUpdateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.dto.response.UserResponse;
import com.example.entity.Apartment;
import com.example.entity.Resident;
import com.example.entity.User;
import com.example.entity.Vehicle;
import com.example.exception.UserInfoException;
import com.example.repository.ApartmentRepository;
import com.example.repository.ResidentRepository;
import com.example.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ResidentService {
    ResidentRepository residentRepository;
    ApartmentRepository apartmentRepository;
    VehicleRepository vehicleRepository;

    public PaginatedResponse<Resident> fetchAllResidents(Specification<Resident> spec, Pageable pageable) {
        // Page<Resident> pageResident = this.residentRepository.findAll(spec,
        // pageable);
        Specification<Resident> notMovedSpec = (root, query, criteriaBuilder) -> criteriaBuilder
                .notEqual(root.get("status"), ResidentEnum.Moved);

        Specification<Resident> combinedSpec = spec == null ? notMovedSpec : spec.and(notMovedSpec);

        Page<Resident> pageResident = this.residentRepository.findAll(combinedSpec, pageable);

        PaginatedResponse<Resident> page = new PaginatedResponse<>();
        page.setPageSize(pageable.getPageSize());
        page.setCurPage(pageable.getPageNumber());
        page.setTotalPages(pageResident.getTotalPages());
        page.setTotalElements(pageResident.getNumberOfElements());
        page.setResult(pageResident.getContent());
        return page;
    }

    public PaginatedResponse<Resident> fetchAll(Specification<Resident> spec, Pageable pageable) {
        Page<Resident> pageResident = this.residentRepository.findAll(spec, pageable);
        PaginatedResponse<Resident> page = new PaginatedResponse<>();
        page.setPageSize(pageable.getPageSize());
        page.setCurPage(pageable.getPageNumber());
        page.setTotalPages(pageResident.getTotalPages());
        page.setTotalElements(pageResident.getNumberOfElements());
        page.setResult(pageResident.getContent());
        return page;
    }

    @Transactional
    public Resident fetchResidentById(Long id) throws RuntimeException {
        return this.residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resident with id = " + id + " is not found"));
    }

    @Transactional
    public Resident createResident(ResidentCreateRequest resident) throws RuntimeException {

        // System.out.println("Residenttest0: " + resident.getName());
        // System.out.println("Residenttest0: " + resident.getDob());
        // System.out.println("Residenttest0: " + resident.getGender());
        // System.out.println("Residenttest0: " + resident.getCic());
        // System.out.println("Residenttest0: " + resident.getStatus());
        // System.out.println("Residenttest0: " + resident.getApartmentId());

        if (this.residentRepository.findById(Long.parseLong(resident.getCic())).isPresent()) {
            throw new RuntimeException("Resident with id = " + resident.getCic() + " already exists");
        }

        Resident resident1;
        // System.out.println("Residenttest1: " + resident.getName());
        // System.out.println("Residenttest1: " + resident.getDob());
        // System.out.println("Residenttest1: " + resident.getGender());
        // System.out.println("Residenttest1: " + resident.getCic());
        // System.out.println("Residenttest1: " + resident.getStatus());
        // System.out.println("Residenttest1: " + resident.getApartmentId());

        if (resident.getApartmentId() != 0) {
            Apartment apartment = apartmentRepository.findById(resident.getApartmentId())
                    .orElseThrow(() -> new RuntimeException(
                            "Apartment with id = " + resident.getApartmentId() + " does not exist"));
            List<Resident> residentList = apartment.getResidentList();

            resident1 = Resident.builder()
                    .id(Long.parseLong(resident.getCic()))
                    .name(resident.getName())
                    .dob(resident.getDob())
                    .gender(resident.getGender())
                    .cic(resident.getCic())
                    .apartment(apartment)
                    .status(ResidentEnum.fromString(resident.getStatus()))
                    .build();

            // Set the apartmentId transient field to match the relationship
            resident1.setApartmentId(apartment.getAddressNumber());

            // Synchronize
            residentList.add(resident1);
            apartment.setResidentList(residentList);
            apartmentRepository.save(apartment);
        } else {
            resident1 = Resident.builder()
                    .id(Long.parseLong(resident.getCic()))
                    .name(resident.getName())
                    .dob(resident.getDob())
                    .gender(resident.getGender())
                    .cic(resident.getCic())
                    .apartment(null)
                    .status(ResidentEnum.fromString(resident.getStatus()))
                    .build();
        }

        // The @PrePersist will automatically set isActive=1, but we can set it
        // explicitly too
        resident1.setIsActive(1);

        try {
            return this.residentRepository.save(resident1);
        } catch (Exception e) {
            throw new RuntimeException("Error saving resident: " + e.getMessage());
        }
    }

    @Transactional
    public Resident updateResident(ResidentUpdateRequest resident) throws Exception {
        Resident oldResident = this.fetchResidentById(resident.getId());
        if (oldResident == null) {
            throw new Exception("Resident with id = " + resident.getId() + " is not found");
        }

        if (resident.getStatus() != null && resident.getStatus().equals("Moved")) {
            // Remove from apartment if necessary
            Apartment apartment = apartmentRepository.findByOwner_Id(resident.getId()).orElse(null);

            if (apartment != null) {
                apartment.setCreatedAt(null);
                apartment.setOwner(null);
                apartment.setOwnerPhone(null);
                apartmentRepository.save(apartment);
                List<Resident> residentList = apartment.getResidentList();
                for (Resident r : residentList) {
                    r.setApartment(null);
                    r.setIsActive(0);
                    r.setStatus(ResidentEnum.Moved);
                }
            } else {
                oldResident.setIsActive(0);
                oldResident.setStatus(ResidentEnum.Moved);
                oldResident.setApartment(null);
                residentRepository.save(oldResident);
            }
            return null; // hoặc ném ngoại lệ nếu bạn muốn báo là đã xóa
        }

        // Cập nhật thông tin khác
        if (resident.getName() != null)
            oldResident.setName(resident.getName());
        if (resident.getDob() != null)
            oldResident.setDob(resident.getDob());
        if (resident.getStatus() != null)
            oldResident.setStatus(ResidentEnum.fromString(resident.getStatus()));
        if (resident.getGender() != null)
            oldResident.setGender(resident.getGender());
        if (resident.getCic() != null)
            oldResident.setCic(resident.getCic());
        if (resident.getAddressNumber() != null) {
            Apartment newApartment = apartmentRepository.findById(resident.getAddressNumber())
                    .orElseThrow(() -> new RuntimeException(
                            "Apartment with address number " + resident.getAddressNumber() + " not found"));
            List<Resident> residentList = newApartment.getResidentList();
            residentList.add(oldResident);
            newApartment.setResidentList(residentList);
            apartmentRepository.save(newApartment);
            oldResident.setApartment(newApartment);
        }

        try {
            return residentRepository.save(oldResident);
        } catch (Exception e) {
            throw new RuntimeException("Error saving resident: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> deleteResident(Long id) throws Exception {
        Resident resident = this.fetchResidentById(id);
        resident.setIsActive(0);
        if (resident.getApartment() != null) {
            Apartment apartment = apartmentRepository.findById(resident.getApartmentId()).orElseThrow(
                    () -> new RuntimeException("Apartment with id " + resident.getApartmentId() + " not found"));
            List<Resident> residentList = apartment.getResidentList();
            residentList.remove(resident);
            apartment.setResidentList(residentList);
        }
        resident.setApartment(null);
        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("delete resident success");
        response.setData(null);
        return response;
    }

}
