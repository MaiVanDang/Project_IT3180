package com.example.repository;

import com.example.entity.Fee;
import com.example.entity.FeeInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FeeInvoiceRepository extends JpaRepository<FeeInvoice, Long>, JpaSpecificationExecutor<FeeInvoice> {
    @Query("SELECT fi.fee FROM FeeInvoice fi WHERE fi.invoice.id = :invoiceId")
    List<Fee> findFeesByInvoiceId(@Param("invoiceId") String invoiceId);

    @Modifying //Required to be used in queries that change data such as UPDATE, DELETE (i.e. not a SELECT query.)
    @Transactional
    @Query("DELETE FROM FeeInvoice fi WHERE fi.invoice.id = :invoiceId")
    void deleteByInvoiceId(String invoiceId);


}
