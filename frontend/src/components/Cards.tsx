import styled from "styled-components";
import Card from "./Card";
import { PiBuildingApartment } from "react-icons/pi";
import { MdFamilyRestroom, MdAttachMoney } from "react-icons/md";
import { FaCar, FaMoneyBillWave } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import axios from "axios";
import { useEffect, useState } from "react";

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  padding: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color};
  color: white;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 8px 0;
  font-weight: 500;
`;

const StatValue = styled.h2`
  font-size: 28px;
  color: #111827;
  margin: 0;
  font-weight: 700;
`;

const TrendIndicator = styled.span<{ positive: boolean }>`
  font-size: 14px;
  color: ${({ positive }) => (positive ? "#10b981" : "#ef4444")};
  display: flex;
  align-items: center;
  margin-top: 8px;
  
  svg {
    margin-right: 4px;
  }
`;

export default function EnhancedCards() {
  const [stats, setStats] = useState({
    apartments: 0,
    residents: 0,
    vehicles: 0,
    revenue: 0,
    apartmentTrend: 0,
    residentTrend: 0,
    vehicleTrend: 0,
    revenueTrend: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [apartments, residents, vehicles, invoices] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/apartments?size=999"),
          axios.get("http://localhost:8080/api/v1/residents?size=999"),
          axios.get("http://localhost:8080/api/v1/vehicles?size=999"),
          axios.get("http://localhost:8080/api/v1/invoices/total")
        ]);

        // Calculate 30-day revenue
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        const totalAmount = invoices.data.data.reduce((total: number, invoice: any) => {
          const createDate = new Date(invoice.createDate);
          return createDate >= thirtyDaysAgo ? total + invoice.totalAmount : total;
        }, 0);

        setStats({
          apartments: apartments.data.data.totalElements,
          residents: residents.data.data.totalElements,
          vehicles: vehicles.data.data.totalElements,
          revenue: totalAmount,
          // Mock trend data - in a real app you would compare with previous period
          apartmentTrend: 5.2,
          residentTrend: 8.7,
          vehicleTrend: 3.4,
          revenueTrend: 12.5
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <CardsContainer>
      {/* Revenue Card - Moved to first position as it's often the most important */}
      <StatCard>
        <IconWrapper color="#6366f1">
          <FaMoneyBillWave size={24} />
        </IconWrapper>
        <StatTitle>Doanh thu 30 ngày</StatTitle>
        <StatValue>{formatCurrency(stats.revenue)}</StatValue>
        <TrendIndicator positive={stats.revenueTrend > 0}>
          {stats.revenueTrend > 0 ? '↑' : '↓'} {Math.abs(stats.revenueTrend)}%
        </TrendIndicator>
      </StatCard>

      {/* Residents Card */}
      <StatCard>
        <IconWrapper color="#10b981">
          <MdFamilyRestroom size={24} />
        </IconWrapper>
        <StatTitle>Cư dân</StatTitle>
        <StatValue>{stats.residents}</StatValue>
        <TrendIndicator positive={stats.residentTrend > 0}>
          {stats.residentTrend > 0 ? '↑' : '↓'} {Math.abs(stats.residentTrend)}%
        </TrendIndicator>
      </StatCard>

      {/* Apartments Card */}
      <StatCard>
        <IconWrapper color="#3b82f6">
          <PiBuildingApartment size={24} />
        </IconWrapper>
        <StatTitle>Căn hộ</StatTitle>
        <StatValue>{stats.apartments}</StatValue>
        <TrendIndicator positive={stats.apartmentTrend > 0}>
          {stats.apartmentTrend > 0 ? '↑' : '↓'} {Math.abs(stats.apartmentTrend)}%
        </TrendIndicator>
      </StatCard>

      {/* Vehicles Card */}
      <StatCard>
        <IconWrapper color="#f59e0b">
          <FaCar size={24} />
        </IconWrapper>
        <StatTitle>Phương tiện</StatTitle>
        <StatValue>{stats.vehicles}</StatValue>
        <TrendIndicator positive={stats.vehicleTrend > 0}>
          {stats.vehicleTrend > 0 ? '↑' : '↓'} {Math.abs(stats.vehicleTrend)}%
        </TrendIndicator>
      </StatCard>
    </CardsContainer>
  );
}