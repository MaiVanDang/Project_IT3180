package com.example.service;

import com.example.constant.VehicleEnum;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Apartment;
import com.example.entity.Resident;
import com.example.entity.Vehicle;
import com.example.repository.ApartmentRepository;
import com.example.repository.VehicleRepository;
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
import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ApartmentRepository apartmentRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Apartment apartment;
    private Resident owner;
    private Vehicle vehicle;
    private Vehicle vehicleRequest;

    @BeforeEach
    void setUp() {
        // Khởi tạo dữ liệu giả lập
        owner = new Resident();
        owner.setId(1L);

        apartment = new Apartment();
        apartment.setAddressNumber(1L);
        apartment.setOwner(owner);
        apartment.setVehicleList(new java.util.ArrayList<>()); // Khởi tạo danh sách mutable

        vehicle = new Vehicle();
        vehicle.setId("V001");
        vehicle.setCategory(VehicleEnum.Motorbike);
        vehicle.setApartment(apartment);

        vehicleRequest = new Vehicle();
        vehicleRequest.setId("V001");
        vehicleRequest.setCategory(VehicleEnum.Motorbike);
        vehicleRequest.setApartmentId(1L);
    }

    @Test
    void testFindAllByApartmentId_Success() {
        // Mock
        when(apartmentRepository.existsById(1L)).thenReturn(true);
        when(vehicleRepository.findAllByApartment_AddressNumber(1L)).thenReturn(Arrays.asList(vehicle));

        // Call method
        List<Vehicle> result = vehicleService.findAllByApartmentId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("V001", result.get(0).getId());
        verify(apartmentRepository).existsById(1L);
        verify(vehicleRepository).findAllByApartment_AddressNumber(1L);
    }

    @Test
    void testFindAllByApartmentId_ApartmentNotFound() {
        // Mock
        when(apartmentRepository.existsById(1L)).thenReturn(false);

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> vehicleService.findAllByApartmentId(1L));
        assertEquals("Apartment with id 1 does not exist", exception.getMessage());
        verify(apartmentRepository).existsById(1L);
        verify(vehicleRepository, never()).findAllByApartment_AddressNumber(anyLong());
    }

    @Test
    void testGetAll_Success() {
        // Mock
        Page<Vehicle> page = new PageImpl<>(Arrays.asList(vehicle));
        doAnswer(invocation -> page)
                .when(vehicleRepository)
                .findAll((Specification<Vehicle>) eq(null), any(Pageable.class));

        // Call method
        PaginatedResponse<Vehicle> result = vehicleService.getAll(null, PageRequest.of(0, 10));

        // Assertions
        assertNotNull(result);
        assertEquals(10, result.getPageSize());
        assertEquals(0, result.getCurPage());
        assertEquals(1, result.getResult().size());
        verify(vehicleRepository).findAll((Specification<Vehicle>) eq(null), any(Pageable.class));
    }

    @Test
    void testCreate_Success() {
        // Mock
        when(vehicleRepository.findById("V001")).thenReturn(Optional.empty());
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // Call method
        Vehicle result = vehicleService.create(vehicleRequest);

        // Assertions
        assertNotNull(result);
        assertEquals("V001", result.getId());
        assertEquals(VehicleEnum.Motorbike, result.getCategory());
        assertEquals(apartment, result.getApartment());
        verify(vehicleRepository).save(any(Vehicle.class));
        verify(apartmentRepository, times(2)).findById(1L);
    }

    @Test
    void testCreate_VehicleIdNull() {
        // Sửa vehicleRequest để id là null
        vehicleRequest.setId(null);

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> vehicleService.create(vehicleRequest));
        assertEquals("Vehicle id is null", exception.getMessage());
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void testCreate_VehicleAlreadyExists() {
        // Mock
        when(vehicleRepository.findById("V001")).thenReturn(Optional.of(vehicle));

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> vehicleService.create(vehicleRequest));
        assertEquals("Vehicle with id = V001 already exists", exception.getMessage());
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void testCreate_ApartmentNotFound() {
        // Mock
        when(vehicleRepository.findById("V001")).thenReturn(Optional.empty());
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> vehicleService.create(vehicleRequest));
        assertEquals("Apartment with id 1 does not exist", exception.getMessage());
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void testCreate_ApartmentHasNoOwner() {
        // Sửa apartment để không có owner
        apartment.setOwner(null);

        // Mock
        when(vehicleRepository.findById("V001")).thenReturn(Optional.empty());
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> vehicleService.create(vehicleRequest));
        assertEquals("Apartment with id 1 doesn't have an owner yet. Please assign an owner before registering vehicles.", exception.getMessage());
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void testDeleteVehicle_Success() throws Exception {
        // Sửa apartment để có vehicleList chứa vehicle
        apartment.setVehicleList(new java.util.ArrayList<>(Arrays.asList(vehicle)));

        // Mock
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        when(vehicleRepository.findById("V001")).thenReturn(Optional.of(vehicle));
        when(apartmentRepository.saveAndFlush(any(Apartment.class))).thenReturn(apartment);

        // Call method
        ApiResponse<String> result = vehicleService.deleteVehicle(1L, vehicleRequest);

        // Assertions
        assertNotNull(result);
        assertEquals(HttpStatus.OK.value(), result.getCode());
        assertEquals("delete vehicle success", result.getMessage());
        assertNull(result.getData());
        verify(apartmentRepository).saveAndFlush(any(Apartment.class));
        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void testDeleteVehicle_ApartmentNotFound() {
        // Mock
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> vehicleService.deleteVehicle(1L, vehicleRequest));
        assertEquals("Apartment with id 1 does not exist", exception.getMessage());
        verify(apartmentRepository, never()).saveAndFlush(any(Apartment.class));
        verify(vehicleRepository, never()).delete(any(Vehicle.class));
    }
}