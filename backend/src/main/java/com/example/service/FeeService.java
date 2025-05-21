package com.example.service;

import com.example.constant.FeeTypeEnum;
import com.example.dto.request.FeeCreateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Fee;
import com.example.entity.Resident;
import com.example.exception.UserInfoException;
import com.example.repository.FeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@AllArgsConstructor
public class FeeService {
    private final FeeRepository feeRepository;

    public PaginatedResponse<Fee> fetchAllFees(Specification<Fee> spec, Pageable pageable) {
        Page<Fee> pageFee = feeRepository.findAll(spec, pageable);
        PaginatedResponse<Fee> page = new PaginatedResponse<>();
        page.setPageSize(pageable.getPageSize());
        page.setCurPage(pageable.getPageNumber());
        page.setTotalPages(pageFee.getTotalPages());
        page.setTotalElements(pageFee.getNumberOfElements());
        page.setResult(pageFee.getContent());
        return page;
    }

    public Fee fetchFeeById (Long id) throws RuntimeException {
        return feeRepository.findById(id).orElseThrow(() -> new RuntimeException("Fee with code = " + id + " is not found"));
    }

    public Fee createFee(FeeCreateRequest feeCreateRequest) throws RuntimeException {
        Fee fee = new Fee();
        fee.setName(feeCreateRequest.getName());
        fee.setDescription(feeCreateRequest.getDescription());
        fee.setFeeTypeEnum(feeCreateRequest.getFeeTypeEnum());

        if (feeCreateRequest.getFeeTypeEnum() != FeeTypeEnum.ContributionFund) {
            if (feeCreateRequest.getUnitPrice() == null || feeCreateRequest.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Unit price must be provided and greater than 0 for DepartmentFee or VehicleFee");
            }
            fee.setUnitPrice(feeCreateRequest.getUnitPrice());
        } else {
            fee.setUnitPrice(BigDecimal.ZERO); // ContributionFund không cần unitPrice
        }

        return this.feeRepository.save(fee);
    }

    public Fee updateFee (Fee fee) throws RuntimeException {
        Fee oldFee = this.fetchFeeById(fee.getId());
        if(oldFee != null) {
            if(fee.getName() != null) oldFee.setName(fee.getName());
            if(fee.getDescription() != null) oldFee.setDescription(fee.getDescription());
            if(fee.getFeeTypeEnum() != null) oldFee.setFeeTypeEnum(fee.getFeeTypeEnum());
            if(fee.getUnitPrice() != null) oldFee.setUnitPrice(fee.getUnitPrice());
        } else {
            throw new RuntimeException("Fee with code = " + fee.getId() + " is not found");
        }
        return this.feeRepository.save(oldFee);
    }

    //No exception handling is needed in this method
    public ApiResponse<String> deleteFee(Long id) throws RuntimeException {
       Fee fee = this.fetchFeeById(id);
       this.feeRepository.delete(fee);

       ApiResponse<String> response = new ApiResponse<>();
       response.setCode(HttpStatus.OK.value());
       response.setMessage("delete fee success");
       response.setData(null);
       return response;
    }
}

