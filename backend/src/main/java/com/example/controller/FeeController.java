package com.example.controller;

import com.example.dto.request.FeeCreateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Fee;
import com.example.entity.Resident;
import com.example.service.FeeService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/fees")
@CrossOrigin(origins = "http://localhost:5173")
public class FeeController {

    private final FeeService feeService;

    // fetch all fees
    @GetMapping("")
    public ResponseEntity<PaginatedResponse<Fee>> getAllFees(
            @Filter Specification<Fee> spec,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        PaginatedResponse<Fee> feeResponses = this.feeService.fetchAllFees(spec, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(feeResponses);
    }

    // fetch fee by feeCode
    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeByFeeCode(
            @PathVariable("id") Long id
    ) throws Exception {
        Fee fetchFee = this.feeService.fetchFeeById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchFee);
    }

    // create new fee
    @PostMapping("")
    public ResponseEntity<Fee> createFee(
            @Valid @RequestBody FeeCreateRequest apiFee
    ) throws Exception {
        Fee fee = this.feeService.createFee(apiFee);
        return ResponseEntity.status(HttpStatus.CREATED).body(fee);
    }

    // update fee
    @PutMapping("/")
    public ResponseEntity<Fee> updateFee(
            @RequestBody Fee apiFee
    ) throws Exception {
        Fee fee = this.feeService.updateFee(apiFee);
        return ResponseEntity.status(HttpStatus.OK).body(fee);
    }

    // Delete resident by feeCode
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFee(
            @PathVariable("id") Long id
    ) throws Exception {
        ApiResponse<String> response = this.feeService.deleteFee(id);
        return ResponseEntity.ok(response);
    }
}