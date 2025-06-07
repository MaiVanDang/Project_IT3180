import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./form.css";

// Types
interface StatisticsFormProps {
  statistic: {
    addressNumber: string;
  };
}

interface Fee {
  id: string;
  name: string;
  amount: number;
  feeType: "DepartmentFee" | "ContributionFund";
}

interface Invoice {
  id: string;
  name: string;
  paymentStatus: "Paid" | "Unpaid";
  feeList: Fee[];
}

interface UtilityBill {
  id: string;
  name: string;
  electricity: number;
  water: number;
  internet: number;
  createdAt: string;
  paymentStatus: "Paid" | "Unpaid";
}

// Constants
const API_ENDPOINTS = {
  invoices: "http://localhost:8080/api/v1/invoiceapartment",
  utilities: "http://localhost:8080/api/v1/utilitybills",
};

// Component
const StatisticsForm = ({ statistic }: StatisticsFormProps) => {
  // State
  const [dataInvoice, setDataInvoice] = useState<Invoice[]>([]);
  const [dataUtility, setDataUtility] = useState<UtilityBill[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [voluntaryFund, setVoluntaryFund] = useState<Record<string, number>>({});

  // Event Handlers
  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleVoluntaryFundChange = (invoiceId: string, value: string) => {
    setVoluntaryFund(prev => ({
      ...prev,
      [invoiceId]: parseFloat(value) || 0
    }));
  };

  // API Calls
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.invoices}/${statistic.addressNumber}`);
      setDataInvoice(response.data.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      toast.error("Failed to load invoices");
    }
  };

  const handlePayInvoice = async (invoiceId: string, feeList: Fee[]) => {
    try {
      const payload = feeList.reduce((acc, fee) => {
        if (fee.feeType === "ContributionFund") {
          acc[fee.id] = voluntaryFund[invoiceId] || 0;
        }
        return acc;
      }, {} as Record<string, number>);

      await axios.put(
        `${API_ENDPOINTS.invoices}/update/${statistic.addressNumber}/${invoiceId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Invoice paid successfully!");
      fetchInvoices();
    } catch (err) {
      console.error("Error paying invoice:", err);
      toast.error("Failed to pay invoice");
    }
  };

  const fetchUtilities = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.utilities}/${statistic.addressNumber}`);
      setDataUtility(response.data.data);
    } catch (err) {
      console.error("Error fetching utilities:", err);
      toast.error("Failed to load utility bills");
    }
  };

  const handlePayUtility = async (utilityId: string) => {
    try {
      await axios.post(`${API_ENDPOINTS.utilities}/update/${utilityId}`);
      toast.success("Utility bill paid successfully");
      fetchUtilities();
    } catch (err) {
      console.error("Error paying utility:", err);
      toast.error("Failed to pay utility bill");
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchUtilities();
  }, []);

  // Render Methods
  const renderFeeRow = (fee: Fee, invoiceId: string) => (
    <tr key={fee.id}>
      <td>{fee.name}</td>
      <td>{fee.feeType}</td>
      <td>
        {fee.name === "Fund 2"
          ? (fee.amount + (voluntaryFund[invoiceId] || 0)).toLocaleString()
          : fee.amount.toLocaleString()}{" "}
        VND
      </td>
    </tr>
  );

  const renderVoluntaryFundInput = (invoice: Invoice) => (
    invoice.paymentStatus === "Unpaid" &&
    invoice.feeList.map(fee =>
      fee.feeType === "ContributionFund" && (
        <div className="voluntary-fund" key={fee.name}>
          <label>
            Nhập <strong>{fee.name}</strong>:{" "}
            <input
              className="inputFund"
              type="text"
              value={voluntaryFund[invoice.id] || ""}
              onChange={(e) => handleVoluntaryFundChange(invoice.id, e.target.value)}
            />
          </label>
        </div>
      )
    )
  );

  const renderInvoiceDetails = (invoice: Invoice) => (
    <div className="billing-details">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.feeList.map(fee => renderFeeRow(fee, invoice.id))}
        </tbody>
      </table>

      {renderVoluntaryFundInput(invoice)}

      <div className="total-due">
        Total amount:{" "}
        {invoice.feeList
          .reduce((sum, fee) => {
            const amount = fee.amount + (fee.feeType === "DepartmentFee" ? (voluntaryFund[invoice.id] || 0) : 0);
            return sum + amount;
          }, 0)
          .toLocaleString()}{" "}
        VND
      </div>

      {invoice.paymentStatus === "Unpaid" && (
        <div className="divPay">
          <button
            onClick={() => handlePayInvoice(invoice.id, invoice.feeList)}
            className="payButton"
            type="submit"
          >
            Pay <i className="bx bxs-credit-card-alt"></i>
          </button>
        </div>
      )}
    </div>
  );

  const renderUtilityDetails = (utility: UtilityBill) => (
    <div className="billing-details">
      <table>
        <thead>
          <tr>
            <th>Electricity</th>
            <th>Water</th>
            <th>Internet</th>
            <th>Created At</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{utility.electricity.toLocaleString()} VND</td>
            <td>{utility.water.toLocaleString()} VND</td>
            <td>{utility.internet.toLocaleString()} VND</td>
            <td>{new Date(utility.createdAt).toLocaleDateString()}</td>
            <td>
              {(utility.electricity + utility.water + utility.internet).toLocaleString()} VND
            </td>
          </tr>
        </tbody>
      </table>
      <div className="divPay">
        <button
          onClick={() => handlePayUtility(utility.id)}
          className="payButton"
          type="submit"
        >
          Pay <i className="bx bxs-credit-card-alt"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="wra">
      <div className="cts">
        <p className="invoiceText">Invoice (Fee and Fund):</p>
        {dataInvoice.map((invoice, index) => (
          <div key={index}>
            <div
              className={`billing-header ${invoice.paymentStatus === "Unpaid" ? "incomplete" : "complete"}`}
              onClick={() => toggleDropdown(invoice.id)}
            >
              <span className="spanText">{invoice.name}</span>
              <span className="status">{invoice.paymentStatus}</span>
              <span className={`arrow ${openDropdowns[invoice.id] ? "open" : ""}`}>
                &#9662;
              </span>
            </div>
            {openDropdowns[invoice.id] && renderInvoiceDetails(invoice)}
          </div>
        ))}

        <p className="invoiceText">Utility Bill:</p>
        {dataUtility.map((utility, index) => (
          <div key={index}>
            <div
              className={`billing-header ${utility.paymentStatus === "Unpaid" ? "incomplete" : "complete"}`}
              onClick={() => toggleDropdown(utility.id)}
            >
              <span className="spanText">{utility.name}</span>
              <span className="status">{utility.paymentStatus}</span>
              <span className={`arrow ${openDropdowns[utility.id] ? "open" : ""}`}>
                &#9662;
              </span>
            </div>
            {openDropdowns[utility.id] && renderUtilityDetails(utility)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsForm;