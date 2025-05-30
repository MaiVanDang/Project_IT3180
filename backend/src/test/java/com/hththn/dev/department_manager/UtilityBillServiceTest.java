package com.hththn.dev.department_manager;

import com.example.constant.PaymentEnum;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Apartment;
import com.example.entity.UtilityBill;
import com.example.repository.ApartmentRepository;
import com.example.repository.UtilityBillRepository;
import com.example.service.UtilityBillService;
import jakarta.persistence.EntityNotFoundException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UtilityBillServiceTest {
    @Mock
    private UtilityBillRepository utilityBillRepository;

    @Mock
    private ApartmentRepository apartmentRepository;

    @InjectMocks
    private UtilityBillService utilityBillService;

    private Apartment apartment;
    private UtilityBill utilityBill;
    private MultipartFile mockFile;

    @BeforeEach
    void setUp() {
        // Khởi tạo dữ liệu mock
        apartment = new Apartment();
        apartment.setAddressNumber(1L);

        utilityBill = new UtilityBill();
        utilityBill.setId(1L);
        utilityBill.setApartmentId(1L);
        utilityBill.setElectricity(100.0);
        utilityBill.setWater(50.0);
        utilityBill.setInternet(30.0);
        utilityBill.setPaymentStatus(PaymentEnum.Unpaid);

        // Tạo file Excel mock
        try {
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet();
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ApartmentId");
            header.createCell(1).setCellValue("Electricity");
            header.createCell(2).setCellValue("Water");
            header.createCell(3).setCellValue("Internet");

            Row row = sheet.createRow(1);
            row.createCell(0).setCellValue(1.0); // apartmentId
            row.createCell(1).setCellValue(100.0); // electricity
            row.createCell(2).setCellValue(50.0); // water
            row.createCell(3).setCellValue(30.0); // internet

            ByteArrayInputStream bis = new ByteArrayInputStream(toByteArray(workbook));
            mockFile = new MockMultipartFile("test.xlsx", "test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bis);
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // Helper method to convert Workbook to byte array
    private byte[] toByteArray(Workbook workbook) throws IOException {
        try (var baos = new java.io.ByteArrayOutputStream()) {
            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    @Test
    void testImportExcel_Success() throws IOException {
        // Mock repository
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        when(utilityBillRepository.saveAll(anyList())).thenReturn(new ArrayList<>());

        // Call method
        List<UtilityBill> result = utilityBillService.importExcel(mockFile, "Test Bill");

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(apartmentRepository).findById(1L);
        verify(utilityBillRepository).saveAll(anyList());
    }

    @Test
    void testImportExcel_ApartmentNotFound() throws IOException {
        // Mock repository
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        assertThrows(RuntimeException.class, () -> utilityBillService.importExcel(mockFile, "Test Bill"));
        verify(apartmentRepository).findById(1L);
        verify(utilityBillRepository, never()).saveAll(anyList());
    }

    @Test
    void testFetchUtilityBills_Success() {
        // Mock data
        List<UtilityBill> utilityBills = new ArrayList<>();
        utilityBills.add(utilityBill);
        Page<UtilityBill> page = new PageImpl<>(utilityBills);
        when(utilityBillRepository.findAll(nullable(Specification.class), any(PageRequest.class))).thenReturn(page);

        // Call method
        PaginatedResponse<UtilityBill> result = utilityBillService.fetchUtilityBills(null, PageRequest.of(0, 10));

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.getResult().size());
        verify(utilityBillRepository).findAll(nullable(Specification.class), any(PageRequest.class));
    }

    @Test
    void testFetchUtilityBillsByApartmentId_Success() {
        // Mock data
        List<UtilityBill> utilityBills = new ArrayList<>();
        utilityBills.add(utilityBill);
        when(utilityBillRepository.findByApartmentId(1L)).thenReturn(utilityBills);

        // Call method
        List<UtilityBill> result = utilityBillService.fetchUtilityBillsByApartmentId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(utilityBillRepository).findByApartmentId(1L);
    }

    @Test
    void testUpdateUtilityBill_Success() {
        // Mock data
        when(utilityBillRepository.findById(1L)).thenReturn(Optional.of(utilityBill));
        when(utilityBillRepository.save(utilityBill)).thenReturn(utilityBill);

        // Call method
        UtilityBill result = utilityBillService.updateUtilityBill(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(PaymentEnum.Paid, result.getPaymentStatus());
        verify(utilityBillRepository).findById(1L);
        verify(utilityBillRepository).save(utilityBill);
    }

    @Test
    void testUpdateUtilityBill_NotFound() {
        // Mock data
        when(utilityBillRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        assertThrows(EntityNotFoundException.class, () -> utilityBillService.updateUtilityBill(1L));
        verify(utilityBillRepository).findById(1L);
        verify(utilityBillRepository, never()).save(any());
    }
}
