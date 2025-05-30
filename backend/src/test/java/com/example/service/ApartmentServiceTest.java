package com.example.service;

import com.example.constant.ApartmentEnum;
import com.example.dto.request.ApartmentCreateRequest;
import com.example.dto.request.ApartmentUpdateRequest;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Apartment;
import com.example.entity.Resident;
import com.example.repository.ApartmentRepository;
import com.example.repository.ResidentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApartmentServiceTest {

    @Mock
    private ApartmentRepository apartmentRepository;

    @Mock
    private ResidentRepository residentRepository;

    @Mock
    private ResidentService residentService;

    @InjectMocks
    private ApartmentService apartmentService;

    private Apartment apartment;
    private Resident owner;
    private Resident member;
    private ApartmentCreateRequest createRequest;
    private ApartmentUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        // Khởi tạo dữ liệu giả lập
        owner = new Resident();
        owner.setId(1L);
        owner.setApartment(null);

        member = new Resident();
        member.setId(2L);
        member.setApartment(null);

        apartment = new Apartment();
        apartment.setAddressNumber(1L);
        apartment.setArea(50.0);
        apartment.setOwner(owner);
        apartment.setStatus(ApartmentEnum.Residential);
        apartment.setCreatedAt(Instant.now());
        apartment.setResidentList(Arrays.asList(owner, member));

        createRequest = ApartmentCreateRequest.builder()
                .addressNumber(1L)
                .area(50.0)
                .ownerId(1L)
                .ownerPhone(1234567890L)
                .status(ApartmentEnum.Residential.toString())
                .memberIds(Arrays.asList(1L, 2L))
                .build();

        updateRequest = ApartmentUpdateRequest.builder()
                .ownerId(1L)
                .status(ApartmentEnum.Residential.toString())
                .area(60.0)
                .ownerPhone(9876543210L)
                .residents(Arrays.asList(1L, 2L))
                .build();
    }

    @Test
    void testCreate_ApartmentAlreadyExists() {
        // Mock
        when(apartmentRepository.findByOwner_Id(1L)).thenReturn(Optional.of(apartment));

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> apartmentService.create(createRequest));
        assertEquals("Apartment with id = 1 already exists", exception.getMessage());
        verify(apartmentRepository, never()).save(any(Apartment.class));
    }

    @Test
    void testGetAll_Success() {
        // Mock
        Page<Apartment> page = new PageImpl<>(Arrays.asList(apartment));
        // Sử dụng Lambda để chỉ định rõ phương thức findAll từ JpaSpecificationExecutor
        doAnswer(invocation -> page)
                .when(apartmentRepository)
                .findAll((Specification<Apartment>) eq(null), any(Pageable.class));

        // Call method
        PaginatedResponse<Apartment> result = apartmentService.getAll(null, PageRequest.of(0, 10));

        // Assertions
        assertNotNull(result);
        assertEquals(10, result.getPageSize());
        assertEquals(0, result.getCurPage());
        assertEquals(1, result.getResult().size());

        // Verify với Lambda
        verify(apartmentRepository)
                .findAll((Specification<Apartment>) eq(null), any(Pageable.class));
    }

    @Test
    void testGetDetail_Success() {
        // Mock
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));

        // Call method
        Apartment result = apartmentService.getDetail(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(1L, result.getAddressNumber());
        verify(apartmentRepository).findById(1L);
    }

    @Test
    void testGetDetail_NotFound() {
        // Mock
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> apartmentService.getDetail(1L));
        assertEquals("Can not find apartment with address: 1", exception.getMessage());
        verify(apartmentRepository).findById(1L);
    }

    @Test
    void testUpdate_Success() {
        // Mock
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        when(residentService.fetchResidentById(1L)).thenReturn(owner);
        // Sửa mock để trả về danh sách có thể thay đổi
        when(residentRepository.findAllById(Arrays.asList(1L, 2L)))
                .thenReturn(new ArrayList<>(Arrays.asList(owner, member)));
        when(apartmentRepository.save(any(Apartment.class))).thenReturn(apartment);

        // Call method
        Apartment result = apartmentService.update(1L, updateRequest);

        // Assertions
        assertNotNull(result);
        assertEquals(60.0, result.getArea());
        assertEquals(owner, result.getOwner());
        assertEquals(2, result.getResidentList().size());
        verify(apartmentRepository).save(any(Apartment.class));
        verify(residentRepository, times(3)).save(any(Resident.class));
    }

    @Test
    void testUpdate_NotFound() {
        // Mock
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> apartmentService.update(1L, updateRequest));
        assertEquals("Not found apartment 1", exception.getMessage());
        verify(apartmentRepository, never()).save(any(Apartment.class));
    }
}