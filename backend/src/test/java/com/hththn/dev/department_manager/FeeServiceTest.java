package com.hththn.dev.department_manager;

import com.example.constant.FeeTypeEnum;
import com.example.dto.request.FeeCreateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Fee;
import com.example.repository.FeeRepository;
import com.example.service.FeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FeeServiceTest {

    @Mock
    private FeeRepository feeRepository;

    @InjectMocks
    private FeeService feeService;

    private Fee fee;
    private FeeCreateRequest feeCreateRequest;

    @BeforeEach
    void setUp() {
        // Khởi tạo dữ liệu giả lập
        fee = new Fee();
        fee.setId(1L);
        fee.setName("Department Fee");
        fee.setDescription("Monthly fee for department");
        fee.setFeeTypeEnum(FeeTypeEnum.DepartmentFee);
        fee.setUnitPrice(BigDecimal.valueOf(1000));

        // Khởi tạo FeeCreateRequest
        feeCreateRequest = new FeeCreateRequest();
        feeCreateRequest.setName("Department Fee");
        feeCreateRequest.setDescription("Monthly fee for department");
        feeCreateRequest.setFeeTypeEnum(FeeTypeEnum.DepartmentFee);
        feeCreateRequest.setUnitPrice(BigDecimal.valueOf(1000));
    }

    @Test
    void testFetchAllFees_Success() {
        // Mock data
        List<Fee> fees = new ArrayList<>();
        fees.add(fee);
        Page<Fee> page = new PageImpl<>(fees);
        when(feeRepository.findAll(nullable(Specification.class), any(PageRequest.class))).thenReturn(page);

        // Call method
        PaginatedResponse<Fee> result = feeService.fetchAllFees(null, PageRequest.of(0, 10));

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.getResult().size());
        assertEquals(10, result.getPageSize());
        assertEquals(0, result.getCurPage());
        verify(feeRepository).findAll(nullable(Specification.class), any(PageRequest.class));
    }

    @Test
    void testFetchFeeById_Success() {
        // Mock data
        when(feeRepository.findById(1L)).thenReturn(Optional.of(fee));

        // Call method
        Fee result = feeService.fetchFeeById(1L);

        // Assertions
        assertNotNull(result);
        assertEquals("Department Fee", result.getName());
        verify(feeRepository).findById(1L);
    }

    @Test
    void testFetchFeeById_NotFound() {
        // Mock data
        when(feeRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feeService.fetchFeeById(1L));
        assertEquals("Fee with code = 1 is not found", exception.getMessage());
        verify(feeRepository).findById(1L);
    }

    @Test
    void testCreateFee_DepartmentFee_Success() {
        // Mock data
        when(feeRepository.save(any(Fee.class))).thenReturn(fee);

        // Call method
        Fee result = feeService.createFee(feeCreateRequest);

        // Assertions
        assertNotNull(result);
        assertEquals("Department Fee", result.getName());
        assertEquals(BigDecimal.valueOf(1000), result.getUnitPrice());
        verify(feeRepository).save(any(Fee.class));
    }

    @Test
    void testCreateFee_ContributionFund_Success() {
        // Update feeCreateRequest for ContributionFund
        feeCreateRequest.setFeeTypeEnum(FeeTypeEnum.ContributionFund);
        feeCreateRequest.setUnitPrice(null); // ContributionFund không cần unitPrice

        // Tạo một Fee trả về từ mock với FeeTypeEnum.ContributionFund
        Fee mockFee = new Fee();
        mockFee.setName(feeCreateRequest.getName());
        mockFee.setDescription(feeCreateRequest.getDescription());
        mockFee.setFeeTypeEnum(FeeTypeEnum.ContributionFund);
        mockFee.setUnitPrice(BigDecimal.ZERO);

        // Mock data
        when(feeRepository.save(any(Fee.class))).thenReturn(mockFee);

        // Call method
        Fee result = feeService.createFee(feeCreateRequest);

        // Assertions
        assertNotNull(result);
        assertEquals(FeeTypeEnum.ContributionFund, result.getFeeTypeEnum());
        assertEquals(BigDecimal.ZERO, result.getUnitPrice());
        verify(feeRepository).save(any(Fee.class));
    }

    @Test
    void testCreateFee_DepartmentFee_InvalidUnitPrice() {
        // Update feeCreateRequest with invalid unitPrice
        feeCreateRequest.setUnitPrice(BigDecimal.ZERO);

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feeService.createFee(feeCreateRequest));
        assertEquals("Unit price must be provided and greater than 0 for DepartmentFee or VehicleFee", exception.getMessage());
        verify(feeRepository, never()).save(any(Fee.class));
    }

    @Test
    void testUpdateFee_Success() {
        // Mock data
        when(feeRepository.findById(1L)).thenReturn(Optional.of(fee));
        when(feeRepository.save(any(Fee.class))).thenReturn(fee);

        // Update fee
        Fee updatedFee = new Fee();
        updatedFee.setId(1L);
        updatedFee.setName("Updated Fee");
        updatedFee.setUnitPrice(BigDecimal.valueOf(2000));

        // Call method
        Fee result = feeService.updateFee(updatedFee);

        // Assertions
        assertNotNull(result);
        assertEquals("Updated Fee", result.getName());
        assertEquals(BigDecimal.valueOf(2000), result.getUnitPrice());
        verify(feeRepository).findById(1L);
        verify(feeRepository).save(any(Fee.class));
    }

    @Test
    void testUpdateFee_NotFound() {
        // Mock data
        when(feeRepository.findById(1L)).thenReturn(Optional.empty());

        // Update fee
        Fee updatedFee = new Fee();
        updatedFee.setId(1L);

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feeService.updateFee(updatedFee));
        assertEquals("Fee with code = 1 is not found", exception.getMessage());
        verify(feeRepository).findById(1L);
        verify(feeRepository, never()).save(any(Fee.class));
    }

    @Test
    void testDeleteFee_Success() {
        // Mock data
        when(feeRepository.findById(1L)).thenReturn(Optional.of(fee));
        doNothing().when(feeRepository).delete(any(Fee.class));

        // Call method
        ApiResponse<String> result = feeService.deleteFee(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(HttpStatus.OK.value(), result.getCode());
        assertEquals("delete fee success", result.getMessage());
        assertNull(result.getData());
        verify(feeRepository).findById(1L);
        verify(feeRepository).delete(any(Fee.class));
    }

    @Test
    void testDeleteFee_NotFound() {
        // Mock data
        when(feeRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feeService.deleteFee(1L));
        assertEquals("Fee with code = 1 is not found", exception.getMessage());
        verify(feeRepository).findById(1L);
        verify(feeRepository, never()).delete(any(Fee.class));
    }
}