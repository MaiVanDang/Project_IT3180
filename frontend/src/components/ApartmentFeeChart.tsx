import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Heading from "./Heading";
import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";

// Styled Components
const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: 10px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Constants
const API_ENDPOINT = "http://localhost:8080/api/v1/invoices/total";
const DISPLAY_LIMIT = 5;
const MILLION = 1000000;
const CHART_HEIGHT = 400;
const CHART_MARGINS = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 5,
};

const BAR_PROPS = {
  barSize: 60,
  radius: [10, 10, 0, 0],
};

const BAR_COLORS = {
  total: "#c084fc",
  paid: "#86efac",
  contribution: "#f97316",
};

// Helper Functions
const formatValue = (value: number): string => 
  `${(value / MILLION).toFixed(2)}M`;

const calculateMaxValue = (data: any[], roundTo = MILLION): number => {
  const maxValue = Math.max(
    ...data.flatMap((item) => [
      item.totalAmount,
      item.paidAmount,
      item.contributionAmount,
    ])
  );
  return Math.ceil(maxValue / roundTo) * roundTo;
};

// Component
export default function ApartmentFeeChart() {
  const [feeData, setFeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT);
        const data = response.data.data.slice(0, DISPLAY_LIMIT);
        setFeeData(data);
      } catch (err) {
        console.error("Error fetching invoice data:", err);
      }
    };

    fetchData();
  }, []);

  const maxValue = calculateMaxValue(feeData);

  const renderBar = (dataKey: string, color: string) => (
    <Bar
      yAxisId="left"
      dataKey={dataKey}
      fill={color}
      {...BAR_PROPS}
    >
      <LabelList
        dataKey={dataKey}
        position="top"
        formatter={formatValue}
      />
    </Bar>
  );

  return (
    <ChartBox>
      <Heading as="h2">Biểu đồ thu phí chung cư</Heading>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <RechartsBarChart
          data={feeData}
          margin={CHART_MARGINS}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke={BAR_COLORS.total}
            domain={[0, maxValue]}
            tickFormatter={formatValue}
          />
          <Tooltip formatter={formatValue} />
          <Legend />
          
          {renderBar("totalAmount", BAR_COLORS.total)}
          {renderBar("paidAmount", BAR_COLORS.paid)}
          {renderBar("contributionAmount", BAR_COLORS.contribution)}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}