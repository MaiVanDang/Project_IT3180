import { useState } from "react";
import styled from "styled-components";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

// Types
interface Resident {
  id: string;
  name: string;
  dob: string;
  apartmentId: string;
  status: ResidentStatus;
  cic: string;
  gender: Gender;
}

interface ResidentFormProps {
  resident?: Resident;
  onCloseModal?: () => void;
}

type ResidentStatus = "Resident" | "Moved" | "Temporary" | "Absent";
type Gender = "Male" | "Female";

// Constants
const API_ENDPOINTS = {
  residents: "http://localhost:8080/api/v1/residents",
};

const STATUS_OPTIONS: ResidentStatus[] = ["Resident", "Moved", "Temporary", "Absent"];
const GENDER_OPTIONS: Gender[] = ["Male", "Female"];

// Styled Components
const FormSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-grey-50);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-grey-700);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

// Component
export default function ResidentForm({ resident, onCloseModal }: ResidentFormProps) {
  const [formValues, setFormValues] = useState<Resident>({
    id: resident?.id || "",
    name: resident?.name || "",
    dob: resident?.dob || "",
    apartmentId: resident?.apartmentId || "",
    status: resident?.status || "Resident",
    cic: resident?.cic || "",
    gender: resident?.gender || "Male",
  });

  // Event Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      cic: formValues.id,
      name: formValues.name,
      dob: formValues.dob,
      apartmentId: formValues.apartmentId ? Number(formValues.apartmentId) : 0,
      status: formValues.status,
      gender: formValues.gender
    };

    try {
      await axios.post(API_ENDPOINTS.residents, data);
      handleSuccess("Thêm cư dân thành công!");
    } catch (err) {
      handleError(err);
    }
  };

  const handleUpdateResident = async () => {
    const updateData = {
      id: Number(formValues.id),
      name: formValues.name,
      dob: formValues.dob,
      apartmentId: formValues.apartmentId ? Number(formValues.apartmentId) : 0,
      status: formValues.status,
      gender: formValues.gender,
      cic: formValues.cic || formValues.id
    };

    try {
      await axios.put(API_ENDPOINTS.residents, updateData);
      handleSuccess("Cập nhật cư dân thành công!");
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_ENDPOINTS.residents}/${formValues.id}`);
      handleSuccess("Xóa cư dân thành công");
    } catch (err) {
      handleError(err);
    }
  };

  // Helper Functions
  const handleSuccess = (message: string) => {
    toast.success(message);
    if (onCloseModal) onCloseModal();
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleError = (err: any) => {
    if (err.response) {
      const errorData = err.response.data;
      const errorMessage = errorData.message || getDefaultErrorMessage(err.response.status);
      toast.error(`Lỗi: ${errorMessage}`);
    } else if (err.request) {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!");
    } else {
      toast.error("Không thể kết nối đến máy chủ");
    }
    console.error("Chi tiết lỗi:", err);
  };

  const getDefaultErrorMessage = (status: number): string => {
    switch (status) {
      case 409: return "Cư dân đã tồn tại";
      case 404: return "Không tìm thấy cư dân";
      case 400: return "Dữ liệu không hợp lệ";
      default: return "Có lỗi xảy ra, vui lòng thử lại sau";
    }
  };

  const isFormValid = (): boolean => {
    return Boolean(
      formValues.name.trim() &&
      formValues.dob &&
      formValues.id.trim() &&
      formValues.gender
    );
  };

  // Render Methods
  const renderPersonalInfo = () => (
    <FormSection>
      <SectionTitle>Thông tin cá nhân</SectionTitle>
      <Form.Fields>
        <FormField>
          <FormField.Label label="Họ tên" required />
          <FormField.Input
            id="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Nhập họ tên đầy đủ"
          />
        </FormField>

        <FormField>
          <FormField.Label label="Ngày sinh" required />
          <FormField.Input
            id="dob"
            type="date"
            value={formValues.dob}
            onChange={handleChange}
          />
        </FormField>

        <FormField>
          <FormField.Label label="CCCD/CMND" required />
          <FormField.Input
            id="id"
            value={formValues.id}
            onChange={handleChange}
            placeholder="Nhập số CCCD/CMND"
          />
        </FormField>

        <Selector
          id="gender"
          label="Giới tính"
          required
          value={formValues.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
        />
      </Form.Fields>
    </FormSection>
  );

  const renderApartmentInfo = () => (
    <FormSection>
      <SectionTitle>Thông tin căn hộ</SectionTitle>
      <Form.Fields>
        <FormField>
          <FormField.Label label="Mã căn hộ" />
          <FormField.Input
            id="apartmentId"
            value={formValues.apartmentId}
            onChange={handleChange}
            placeholder="Nhập mã căn hộ (nếu có)"
          />
        </FormField>

        <Selector
          id="status"
          label="Trạng thái"
          value={formValues.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
        />
      </Form.Fields>
    </FormSection>
  );

  const renderButtons = () => (
    resident ? (
      <Form.Buttons>
        <Button
          type="button"
          onClick={handleDelete}
          variation="danger"
          size="medium"
        >
          Xóa
          <span><HiTrash /></span>
        </Button>
        <Button
          onClick={handleUpdateResident}
          type="button"
          variation="secondary"
          size="medium"
        >
          Cập nhật
          <span><HiPencil /></span>
        </Button>
      </Form.Buttons>
    ) : (
      <Form.Buttons>
        <Button
          onClick={handleAddResident}
          size="medium"
          variation="primary"
          type="submit"
          disabled={!isFormValid()}
        >
          <HiOutlinePlusCircle /> Thêm cư dân
        </Button>
      </Form.Buttons>
    )
  );

  return (
    <Form width="500px">
      {renderPersonalInfo()}
      {renderApartmentInfo()}
      {renderButtons()}
    </Form>
  );
}