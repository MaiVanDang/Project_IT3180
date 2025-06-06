package com.example.controller;

import com.example.dto.request.ResidentCreateRequest;
import com.example.dto.request.ResidentUpdateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Resident;
import com.example.service.ResidentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.turkraft.springfilter.boot.Filter;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/residents")
@CrossOrigin(origins = "http://localhost:5173")
public class ResidentController {
    private final ResidentService residentService;

    // fetch all residents
    @GetMapping("")
    public ResponseEntity<PaginatedResponse<Resident>> getAllResidents(@Filter Specification<Resident> spec,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        PaginatedResponse<Resident> residentResponses = this.residentService.fetchAllResidents(spec, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(residentResponses);
    }

    
    // Create new resident
    @PostMapping("")
    public ResponseEntity<Resident> createNewUser(@Valid @RequestBody ResidentCreateRequest apiResident) {
        Resident resident = this.residentService.createResident(apiResident);
        return new ResponseEntity<>(resident, HttpStatus.CREATED);
    }

    // fetch resident by id
    @GetMapping("/{id}")
    public ResponseEntity<Resident> getResidentById(@PathVariable("id") long id) throws Exception {
        Resident fetchResident = this.residentService.fetchResidentById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchResident);
    }

    // Delete resident by id
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteResident(@PathVariable("id") long id) throws Exception {
        ApiResponse<String> response = this.residentService.deleteResident(id);
        return ResponseEntity.ok(response);
    }


    // Update resident
    @PutMapping("")
    public ResponseEntity<Resident> updateUser(@RequestBody ResidentUpdateRequest apiResident) throws Exception {
        Resident resident = this.residentService.updateResident(apiResident);
        return ResponseEntity.ok(resident);
    }

    @GetMapping("/all")
    public ResponseEntity<PaginatedResponse<Resident>> getAll(@Filter Specification<Resident> spec,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        PaginatedResponse<Resident> residentResponses = this.residentService.fetchAll(spec, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(residentResponses);
    }
    

}
