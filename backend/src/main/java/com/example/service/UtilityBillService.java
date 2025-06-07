package com.example.service;

import com.example.constant.PaymentEnum;
import com.example.dto.response.PaginatedResponse;
import com.example.entity.Apartment;
import com.example.entity.Fee;
import com.example.entity.InvoiceApartment;
import com.example.entity.UtilityBill;
import com.example.repository.ApartmentRepository;
import com.example.repository.UtilityBillRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UtilityBillService {
    private final UtilityBillRepository utilityBillRepository;
    private final ApartmentRepository apartmentRepository;

    /**
     * Import utility bills from Excel file
     */
    public List<UtilityBill> importExcel(final MultipartFile file, final String name) {
        final List<UtilityBill> utilityBills = new ArrayList<>();
        
        try (InputStream inputStream = file.getInputStream()) {
            final Workbook workbook = WorkbookFactory.create(inputStream);
            final Sheet sheet = workbook.getSheetAt(0);

            sheet.forEach(row -> {
                if (row.getRowNum() == 0 || isEmptyRow(row)) {
                    return;
                }

                final var apartmentId = (long) row.getCell(0).getNumericCellValue();
                final var electricity = row.getCell(1).getNumericCellValue();
                final var water = row.getCell(2).getNumericCellValue();
                final var internet = row.getCell(3).getNumericCellValue();

                final var apartment = findApartmentById(apartmentId);
                
                final var utilityBill = buildUtilityBill(apartment, apartmentId, electricity, water, internet, name);
                utilityBills.add(utilityBill);
            });

            return this.utilityBillRepository.saveAll(utilityBills);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file", e);
        }
    }

    /**
     * Fetch paginated utility bills
     */
    public PaginatedResponse<UtilityBill> fetchUtilityBills(
            final Specification<UtilityBill> spec, 
            final Pageable pageable) {
        final var pageUtilityBill = this.utilityBillRepository.findAll(spec, pageable);
        
        return PaginatedResponse.<UtilityBill>builder()
                .pageSize(pageable.getPageSize())
                .curPage(pageable.getPageNumber())
                .totalPages(pageUtilityBill.getTotalPages())
                .totalElements(pageUtilityBill.getNumberOfElements())
                .result(pageUtilityBill.getContent())
                .build();
    }

    /**
     * Fetch utility bills by apartment ID
     */
    public List<UtilityBill> fetchUtilityBillsByApartmentId(final Long id) {
        return Optional.ofNullable(id)
                .map(this.utilityBillRepository::findByApartmentId)
                .orElse(new ArrayList<>());
    }

    /**
     * Update utility bill payment status
     */
    @Transactional
    public UtilityBill updateUtilityBill(final Long id) {
        final var utilityBill = this.utilityBillRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                    String.format("Utility bill with id %d not found", id)));
                    
        utilityBill.setPaymentStatus(PaymentEnum.Paid);
        return this.utilityBillRepository.save(utilityBill);
    }

    // Private helper methods
    private boolean isEmptyRow(final Row row) {
        return row.getCell(0) == null || row.getCell(0).getCellType() == CellType.BLANK;
    }

    private Apartment findApartmentById(final Long apartmentId) {
        return this.apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new EntityNotFoundException(
                    String.format("Apartment with id %d not found", apartmentId)));
    }

    private UtilityBill buildUtilityBill(
            final Apartment apartment,
            final Long apartmentId,
            final double electricity,
            final double water,
            final double internet,
            final String name) {
        return UtilityBill.builder()
                .apartment(apartment)
                .apartmentId(apartmentId)
                .electricity(electricity)
                .water(water)
                .internet(internet)
                .name(name)
                .paymentStatus(PaymentEnum.Unpaid)
                .build();
    }
}