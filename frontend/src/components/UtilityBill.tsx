import { useState } from "react";
import "./utility.css";
import Table from "./Table";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";

// Constants
const API_ENDPOINT = "http://localhost:8080/api/v1/utilitybills/import";

// Types
interface ExcelData {
  apartmentId: number;
  electricity: number;
  water: number;
  internet: number;
}

// Component
const UtilityBill = () => {
  // State management
  const [dataExcel, setDataExcel] = useState<ExcelData[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [billName, setBillName] = useState("");

  // Handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      readExcelFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!isValidSubmission()) {
      return;
    }

    try {
      await submitUtilityBill();
      showSuccessMessage();
    } catch (error) {
      handleSubmissionError(error);
    }
  };

  // Helper functions
  const isValidSubmission = (): boolean => {
    if (!selectedFile || !billName) {
      toast.error("Please select a file and enter a bill name.");
      return false;
    }
    return true;
  };

  const submitUtilityBill = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile as File);
    formData.append("name", billName);

    const response = await axios.post(API_ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  const showSuccessMessage = () => {
    toast.success("Add Utility Bill Successfully!");
  };

  const handleSubmissionError = (error: any) => {
    console.error("Upload error:", error);
    toast.error("An error occurred while uploading the file.");
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      setDataExcel(jsonData as ExcelData[]);
    };

    reader.readAsArrayBuffer(file);
  };

  // Render methods
  const renderFileUpload = () => (
    <>
      <input
        type="file"
        id="upload"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label id="uploadLabel" htmlFor="upload">
        <i className="bx bx-upload"></i> Upload File
      </label>
      {fileName && <p className="file-name">Selected File: {fileName}</p>}
    </>
  );

  const renderDataTable = () => (
    <Table columns="1fr 1.4fr 1.4fr 1.4fr">
      <Table.Header size="small">
        <div>Apartment</div>
        <div>Electricity</div>
        <div>Water</div>
        <div>Internet</div>
      </Table.Header>

      {dataExcel.map((room, index) => (
        <Table.Row size="small" key={index}>
          <div>{room.apartmentId}</div>
          <div>{room.electricity}</div>
          <div>{room.water}</div>
          <div>{room.internet}</div>
        </Table.Row>
      ))}
    </Table>
  );

  const renderBillNameInput = () => (
    <div className="inputName">
      <label id="lbName" htmlFor="billName">
        Bill Name:{" "}
      </label>
      <input
        id="billName"
        type="text"
        value={billName}
        onChange={(e) => setBillName(e.target.value)}
      />
    </div>
  );

  return (
    <div className="ctn-tdn">
      {renderFileUpload()}
      <div className="table-tdn">
        <label id="utilityLabel">Utility Bill</label>
        {renderDataTable()}
        {renderBillNameInput()}
        <button type="submit" className="saveBtn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default UtilityBill;