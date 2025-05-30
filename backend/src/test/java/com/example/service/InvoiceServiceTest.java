package com.example.service;

import com.example.constant.FeeTypeEnum;
import com.example.constant.PaymentEnum;
import com.example.dto.request.InvoiceRequest;
import com.example.dto.response.*;
import com.example.entity.*;
import com.example.repository.*;
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
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private FeeRepository feeRepository;

    @Mock
    private FeeInvoiceRepository feeInvoiceRepository;

    @Mock
    private ApartmentRepository apartmentRepository;

    @Mock
    private InvoiceApartmentRepository invoiceApartmentRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    private Invoice invoice;
    private Fee fee;
    private Apartment apartment;
    private InvoiceApartment invoiceApartment;
    private InvoiceRequest invoiceRequest;
    private FeeInvoice feeInvoice;

    @BeforeEach
    void setUp() {
        // Khởi tạo dữ liệu giả lập
        invoice = new Invoice();
        invoice.setId("INV001");
        invoice.setName("Monthly Invoice");
        invoice.setDescription("Monthly fees");
        invoice.setIsActive(1);
        invoice.setUpdatedAt(Instant.now());
        invoice.setCreatedAt(LocalDate.now());

        fee = new Fee();
        fee.setId(1L);
        fee.setName("Department Fee");
        fee.setFeeTypeEnum(FeeTypeEnum.DepartmentFee);
        fee.setUnitPrice(BigDecimal.valueOf(1000));

        // Thêm FeeInvoice và liên kết với invoice
        feeInvoice = new FeeInvoice();
        feeInvoice.setFee(fee);
        feeInvoice.setInvoice(invoice);
        invoice.setFeeInvoices(List.of(feeInvoice));

        apartment = new Apartment();
        apartment.setAddressNumber(1L);
        apartment.setArea(50.0);
        apartment.setNumberOfCars(1L);
        apartment.setNumberOfMotorbikes(2L);

        invoiceApartment = new InvoiceApartment();
        invoiceApartment.setId(1L);
        invoiceApartment.setApartment(apartment);
        invoiceApartment.setInvoice(invoice);
        invoiceApartment.setPaymentStatus(PaymentEnum.Unpaid);
        Map<Long, Double> feeAmounts = new HashMap<>();
        feeAmounts.put(1L, 500.0);
        invoiceApartment.setFeeAmounts(feeAmounts);

        // Sử dụng builder để khởi tạo InvoiceRequest
        invoiceRequest = InvoiceRequest.builder()
                .invoiceId("INV001")
                .name("Monthly Invoice")
                .description("Monthly fees")
                .feeIds(List.of(1L))
                .apartmentId(1L)
                .build();
    }

    @Test
    void testFetchAllInvoices_Success() {
        // Mock data
        List<Invoice> invoices = new ArrayList<>();
        invoices.add(invoice);
        Page<Invoice> page = new PageImpl<>(invoices);
        when(invoiceRepository.findAll(nullable(Specification.class), any(PageRequest.class))).thenReturn(page);

        // Call method
        PaginatedResponse<InvoiceResponse> result = invoiceService.fetchAllInvoices(null, PageRequest.of(0, 10));

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.getResult().size());
        assertEquals(10, result.getPageSize());
        assertEquals(0, result.getCurPage());
        verify(invoiceRepository).findAll(nullable(Specification.class), any(PageRequest.class));
    }

    @Test
    void testFetchInvoiceById_Success() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.of(invoice));
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        InvoiceResponse result = invoiceService.fetchInvoiceById("INV001");

        // Assertions
        assertNotNull(result);
        assertEquals("INV001", result.getId());
        assertEquals(1, result.getIsActive());
        assertEquals(1, result.getFeeList().size());
        verify(invoiceRepository).findById("INV001");
        verify(feeInvoiceRepository).findFeesByInvoiceId("INV001");
    }

    @Test
    void testFetchInvoiceById_NotFound() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.fetchInvoiceById("INV001"));
        assertEquals("Invoice with code = INV001 is not found", exception.getMessage());
        verify(invoiceRepository).findById("INV001");
    }

    @Test
    void testFetchInvoiceById_NotActive() {
        // Mock data
        invoice.setIsActive(0);
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.of(invoice));

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.fetchInvoiceById("INV001"));
        assertEquals("Invoice with id INV001 is not active", exception.getMessage());
        verify(invoiceRepository).findById("INV001");
    }

    @Test
    void testFetchAllInvoicesByApartmentId_Success_DepartmentFee() {
        // Mock data
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        InvoiceApartmentResponse response = new InvoiceApartmentResponse(
                "INV001", "Monthly Invoice", "Monthly fees", invoice.getUpdatedAt(),
                LocalDate.of(2025, 5, 30), PaymentEnum.Unpaid, null
        );
        when(invoiceApartmentRepository.findInvoicesByApartmentId(1L)).thenReturn(Arrays.asList(response));
        when(invoiceApartmentRepository.findByInvoiceIdAndApartmentAddressNumber("INV001", 1L)).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        List<InvoiceApartmentResponse> result = invoiceService.fetchAllInvoicesByApartmentId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("INV001", result.get(0).getId());
        assertEquals("Monthly fees", result.get(0).getDescription());
        assertEquals(1, result.get(0).getFeeList().size());
        assertEquals("Department Fee", result.get(0).getFeeList().get(0).getName());
        // Kiểm tra amount (DepartmentFee based on area: 1000 * 50)
        assertEquals(50000.0, result.get(0).getFeeList().get(0).getAmount(), 0.01);
        verify(apartmentRepository).findById(1L);
        verify(invoiceApartmentRepository).findInvoicesByApartmentId(1L);
        verify(feeInvoiceRepository).findFeesByInvoiceId("INV001");
    }

    @Test
    void testFetchAllInvoicesByApartmentId_Success_VehicleFee() {
        // Sửa fee thành VehicleFee
        fee.setFeeTypeEnum(FeeTypeEnum.VehicleFee);

        // Mock data
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        InvoiceApartmentResponse response = new InvoiceApartmentResponse(
                "INV001", "Monthly Invoice", "Monthly fees", invoice.getUpdatedAt(),
                LocalDate.of(2025, 5, 30), PaymentEnum.Unpaid, null
        );
        when(invoiceApartmentRepository.findInvoicesByApartmentId(1L)).thenReturn(Arrays.asList(response));
        when(invoiceApartmentRepository.findByInvoiceIdAndApartmentAddressNumber("INV001", 1L)).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        List<InvoiceApartmentResponse> result = invoiceService.fetchAllInvoicesByApartmentId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getFeeList().size());
        // Kiểm tra amount (VehicleFee: 1 car * 1,200,000 + 2 motorbikes * 70,000)
        assertEquals(1200000 + 2 * 70000, result.get(0).getFeeList().get(0).getAmount(), 0.01);
        verify(apartmentRepository).findById(1L);
        verify(invoiceApartmentRepository).findInvoicesByApartmentId(1L);
        verify(feeInvoiceRepository).findFeesByInvoiceId("INV001");
    }

    @Test
    void testFetchAllInvoicesByApartmentId_Success_ContributionFund() {
        // Sửa fee thành ContributionFund
        fee.setFeeTypeEnum(FeeTypeEnum.ContributionFund);

        // Mock data
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        InvoiceApartmentResponse response = new InvoiceApartmentResponse(
                "INV001", "Monthly Invoice", "Monthly fees", invoice.getUpdatedAt(),
                LocalDate.of(2025, 5, 30), PaymentEnum.Unpaid, null
        );
        when(invoiceApartmentRepository.findInvoicesByApartmentId(1L)).thenReturn(Arrays.asList(response));
        when(invoiceApartmentRepository.findByInvoiceIdAndApartmentAddressNumber("INV001", 1L)).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        List<InvoiceApartmentResponse> result = invoiceService.fetchAllInvoicesByApartmentId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getFeeList().size());
        // Kiểm tra amount (ContributionFund: lấy từ feeAmounts)
        assertEquals(500.0, result.get(0).getFeeList().get(0).getAmount(), 0.01);
        verify(apartmentRepository).findById(1L);
        verify(invoiceApartmentRepository).findInvoicesByApartmentId(1L);
        verify(feeInvoiceRepository).findFeesByInvoiceId("INV001");
    }

    @Test
    void testFetchAllInvoicesByApartmentId_NotFound() {
        // Mock data
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> invoiceService.fetchAllInvoicesByApartmentId(1L));
        assertEquals("Not found apartment 1", exception.getMessage());
        verify(apartmentRepository).findById(1L);
    }

    @Test
    void testUpdateContributionFund_Success() {
        // Sửa fee thành ContributionFund để amount được lấy từ feeAmounts
        fee.setFeeTypeEnum(FeeTypeEnum.ContributionFund);

        // Mock data
        Map<Long, Double> feeAmounts = new HashMap<>();
        feeAmounts.put(1L, 600.0);
        when(invoiceApartmentRepository.findByInvoiceIdAndApartmentAddressNumber("INV001", 1L)).thenReturn(invoiceApartment);
        when(invoiceApartmentRepository.save(any(InvoiceApartment.class))).thenReturn(invoiceApartment);
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        InvoiceApartmentResponse response = new InvoiceApartmentResponse(
                "INV001", "Monthly Invoice", "Monthly fees", invoice.getUpdatedAt(),
                LocalDate.of(2025, 5, 30), PaymentEnum.Unpaid, null
        );
        when(invoiceApartmentRepository.findInvoicesByApartmentId(1L)).thenReturn(Arrays.asList(response));
        when(invoiceApartmentRepository.findByInvoiceIdAndApartmentAddressNumber("INV001", 1L)).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        List<InvoiceApartmentResponse> result = invoiceService.updateContributionFund(1L, "INV001", feeAmounts);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(600.0, result.get(0).getFeeList().get(0).getAmount(), 0.01); // Updated contribution amount
        verify(invoiceApartmentRepository, times(2)).findByInvoiceIdAndApartmentAddressNumber("INV001", 1L); // Cho phép gọi 2 lần
        verify(invoiceApartmentRepository).save(any(InvoiceApartment.class));
    }

    @Test
    void testUpdateInvoiceApartment_Success() {
        // Mock data
        when(invoiceApartmentRepository.findById(1L)).thenReturn(Optional.of(invoiceApartment));
        when(invoiceApartmentRepository.save(any(InvoiceApartment.class))).thenReturn(invoiceApartment);

        // Call method
        InvoiceApartment result = invoiceService.updateInvoiceApartment(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(PaymentEnum.Paid, result.getPaymentStatus());
        verify(invoiceApartmentRepository).findById(1L);
        verify(invoiceApartmentRepository).save(any(InvoiceApartment.class));
    }

    @Test
    void testUpdateInvoiceApartment_NotFound() {
        // Mock data
        when(invoiceApartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> invoiceService.updateInvoiceApartment(1L));
        assertEquals("Not found id 1", exception.getMessage());
        verify(invoiceApartmentRepository).findById(1L);
    }

    @Test
    void testCreateInvoice_Success_WithApartment() {
        // Mock data
        // Lần đầu trả về Optional.empty() để kiểm tra hóa đơn không tồn tại
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.empty())
                .thenReturn(Optional.of(invoice)); // Lần thứ hai trả về invoice để lấy updatedAt
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);
        when(feeRepository.findAllById(anyList())).thenReturn(Arrays.asList(fee));
        when(feeInvoiceRepository.save(any(FeeInvoice.class))).thenReturn(new FeeInvoice());
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        when(invoiceApartmentRepository.save(any(InvoiceApartment.class))).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        InvoiceResponse result = invoiceService.createInvoice(invoiceRequest);

        // Debug: Kiểm tra feeList trước khi assert
        System.out.println("FeeList size: " + result.getFeeList().size());
        if (result.getFeeList() != null) {
            result.getFeeList().forEach(fee -> System.out.println("Fee: " + fee));
        } else {
            System.out.println("FeeList is null");
        }

        // Assertions
        assertNotNull(result);
        assertEquals("INV001", result.getId());
        assertEquals(1, result.getIsActive());
        assertEquals(1, result.getFeeList().size());
        verify(invoiceRepository, times(1)).findById("INV001");
        verify(invoiceRepository).save(any(Invoice.class));
        verify(feeInvoiceRepository, atLeastOnce()).save(any(FeeInvoice.class));
        verify(invoiceApartmentRepository).save(any(InvoiceApartment.class));
    }

    @Test
    void testCreateInvoice_Success_WithoutApartment() {
        // Mock data
        invoiceRequest = InvoiceRequest.builder()
                .invoiceId("INV001")
                .name("Monthly Invoice")
                .description("Monthly fees")
                .feeIds(List.of(1L))
                .apartmentId(null)
                .build();
        // Lần đầu trả về Optional.empty() để kiểm tra hóa đơn không tồn tại
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.empty())
                .thenReturn(Optional.of(invoice)); // Lần thứ hai trả về invoice để lấy updatedAt
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);
        when(feeRepository.findAllById(anyList())).thenReturn(Arrays.asList(fee));
        when(feeInvoiceRepository.save(any(FeeInvoice.class))).thenReturn(new FeeInvoice());
        when(apartmentRepository.findAll()).thenReturn(Arrays.asList(apartment));
        when(invoiceApartmentRepository.save(any(InvoiceApartment.class))).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        InvoiceResponse result = invoiceService.createInvoice(invoiceRequest);

        // Debug: Kiểm tra feeList trước khi assert
        System.out.println("Invoice isActive (before save): " + invoice.getIsActive());
        System.out.println("Invoice updatedAt (before save): " + invoice.getUpdatedAt());
        System.out.println("InvoiceResponse isActive: " + result.getIsActive());
        System.out.println("InvoiceResponse lastUpdated: " + result.getLastUpdated());

        // Assertions
        assertNotNull(result);
        assertEquals("INV001", result.getId());
        assertEquals(1, result.getIsActive());
        assertEquals(1, result.getFeeList().size());
        verify(invoiceRepository, times(1)).findById("INV001");
        verify(invoiceRepository).save(any(Invoice.class));
        verify(feeInvoiceRepository, atLeastOnce()).save(any(FeeInvoice.class));
        verify(invoiceApartmentRepository, atLeastOnce()).save(any(InvoiceApartment.class));
    }

    @Test
    void testCreateInvoice_AlreadyActive() {
        // Mock data
        invoice.setIsActive(1);
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.of(invoice));

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.createInvoice(invoiceRequest));
        assertEquals("Invoice with id = INV001 is already actived", exception.getMessage());
        verify(invoiceRepository).findById("INV001");
    }

    @Test
    void testCreateInvoice_ApartmentNotFound() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.empty());
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);
        when(feeRepository.findAllById(anyList())).thenReturn(Arrays.asList(fee));
        when(feeInvoiceRepository.save(any(FeeInvoice.class))).thenReturn(new FeeInvoice());
        when(apartmentRepository.findById(1L)).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.createInvoice(invoiceRequest));
        assertEquals("Apartment not found: 1", exception.getMessage());
        verify(apartmentRepository).findById(1L);
    }

    @Test
    void testGetAllTotalInvoices_Success() {
        // Mock data
        when(apartmentRepository.findAll()).thenReturn(Arrays.asList(apartment));
        when(apartmentRepository.findById(1L)).thenReturn(Optional.of(apartment));
        InvoiceApartmentResponse response = new InvoiceApartmentResponse(
                "INV001", "Monthly Invoice", "Monthly fees", invoice.getUpdatedAt(),
                LocalDate.of(2025, 5, 30), PaymentEnum.Paid, null
        );
        when(invoiceApartmentRepository.findInvoicesByApartmentId(1L)).thenReturn(Arrays.asList(response));
        when(invoiceApartmentRepository.findByInvoiceIdAndApartmentAddressNumber("INV001", 1L)).thenReturn(invoiceApartment);
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        List<TotalInvoiceResponse> result = invoiceService.getAllTotalInvoices();

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("INV001", result.get(0).getId());
        assertEquals(50000.0, result.get(0).getTotalAmount(), 0.01);
        assertEquals(50000.0, result.get(0).getPaidAmount(), 0.01);
        assertEquals(0.0, result.get(0).getContributionAmount(), 0.01);
        verify(apartmentRepository).findAll();
        verify(apartmentRepository).findById(1L);
    }

    @Test
    void testUpdateInvoice_Success() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);
        when(feeRepository.findAllById(anyList())).thenReturn(Arrays.asList(fee));
        when(feeInvoiceRepository.save(any(FeeInvoice.class))).thenReturn(new FeeInvoice());
        doNothing().when(feeInvoiceRepository).deleteByInvoiceId("INV001");
        when(feeInvoiceRepository.findFeesByInvoiceId("INV001")).thenReturn(Arrays.asList(fee));

        // Call method
        InvoiceResponse result = invoiceService.updateInvoice(invoiceRequest);

        // Assertions
        assertNotNull(result);
        assertEquals("INV001", result.getId());
        assertEquals(1, result.getFeeList().size());
        verify(invoiceRepository, times(2)).findById("INV001");
        verify(invoiceRepository).save(any(Invoice.class));
        verify(feeInvoiceRepository).deleteByInvoiceId("INV001");
        verify(feeInvoiceRepository, atLeastOnce()).save(any(FeeInvoice.class));
    }

    @Test
    void testUpdateInvoice_NotFound() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.updateInvoice(invoiceRequest));
        assertEquals("Invoice with code = INV001 is not found", exception.getMessage());
        verify(invoiceRepository).findById("INV001");
    }

    @Test
    void testDeleteInvoice_Success() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.of(invoice));
        doNothing().when(feeInvoiceRepository).deleteByInvoiceId("INV001");
        doNothing().when(invoiceApartmentRepository).deleteByInvoiceId("INV001");
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        // Call method
        ApiResponse<String> result = invoiceService.deleteInvoice("INV001");

        // Assertions
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("delete invoice success", result.getMessage());
        verify(invoiceRepository).findById("INV001");
        verify(feeInvoiceRepository).deleteByInvoiceId("INV001");
        verify(invoiceApartmentRepository).deleteByInvoiceId("INV001");
        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void testDeleteInvoice_NotFound() {
        // Mock data
        when(invoiceRepository.findById("INV001")).thenReturn(Optional.empty());

        // Call method and expect exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> invoiceService.deleteInvoice("INV001"));
        assertEquals("Invoice with code = INV001 is not found", exception.getMessage());
        verify(invoiceRepository).findById("INV001");
    }
}