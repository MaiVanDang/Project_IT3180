import { useState } from "react";
import styled from "styled-components";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

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

export default function ResidentForm({ resident, onCloseModal }: any) {
  // Giữ nguyên tất cả các biến state và mapping từ backend
  const [formValues, setFormValues] = useState({
    id: resident?.id || "",
    name: resident?.name || "",
    dob: resident?.dob || "",
    apartmentId: resident?.apartmentId || "",
    status: resident?.status || "Resident",
    cic: resident?.cic || "",
    gender: resident?.gender || "",
  });

  // Giữ nguyên các options
  const statusOptions = ["Resident", "Moved", "Temporary", "Absent"];
  const genderOptions = ["Male", "Female"];

  // Giữ nguyên hàm handleChange
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Giữ nguyên hàm handleAddResident với đúng data structure gửi đến backend
  const handleAddResident = async (e: any) => {
    e.preventDefault();

    const data = {
      cic: formValues.id,
      name: formValues.name,
      dob: formValues.dob,
      apartmentId: formValues.apartmentId ? Number(formValues.apartmentId) : 0,
      status: formValues.status,
      gender: formValues.gender
    }
    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/residents",
        data
      );

      toast.success(`Thêm cư dân thành công!`);
      if (onCloseModal) onCloseModal();
      setTimeout(() => window.location.reload(), 1000);

    } catch (err: any) {
      // Giữ nguyên xử lý lỗi từ backend
      if (err.response) {
        const errorData = err.response.data;

        switch (err.response.status) {
          case 409: // Conflict - Resource Already Exists
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          case 404: // Not Found - Apartment Not Found
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          case 400: // Bad Request - Validation Error
            toast.error(`Lỗi: ${errorData.message}`);
            break;
          default:
            toast.error(`Lỗi: ${errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau"}`);
        }
      } else if (err.request) {
        // Không nhận được phản hồi từ server
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!");
      } else {
        toast.error("Không thể kết nối đến máy chủ");
      }
      console.error("Chi tiết lỗi:", err);
    }
  };

  // Giữ nguyên hàm handleUpdateResident với đúng data structure
  const handleUpdateResident = async () => {
    try {
      const updateData = {
        id: Number(formValues.id),
        name: formValues.name,
        dob: formValues.dob,
        apartmentId: formValues.apartmentId ? Number(formValues.apartmentId) : 0,
        status: formValues.status,
        gender: formValues.gender,
        cic: formValues.cic || formValues.id
      };

      console.log("Dữ liệu cập nhật:", updateData);

      // Gửi request PUT đến endpoint update
      const response = await axios.put(
        "http://localhost:8080/api/v1/residents",
        updateData
      );

      toast.success("Cập nhật cư dân thành công!");

      if (onCloseModal) {
        onCloseModal();
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err: any) {
      if (err.response) {
        const errorData = err.response.data;

        switch (err.response.status) {
          case 404: // Not Found
            toast.error(`Lỗi: ${errorData.message || "Không tìm thấy cư dân"}`);
            break;
          case 400: // Bad Request - Validation Error
            toast.error(`Lỗi: ${errorData.message || "Dữ liệu không hợp lệ"}`);
            break;
          default:
            toast.error(`Lỗi: ${errorData.message || "Có lỗi xảy ra khi cập nhật cư dân"}`);
        }
      } else if (err.request) {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!");
      } else {
        toast.error("Không thể kết nối đến máy chủ");
      }
      console.error("Chi tiết lỗi:", err);
    }
  };

  // Giữ nguyên hàm handleDelete
  const handleDelete = async () => {
    try {
      console.log(formValues.id);
      const response = await axios.delete(`http://localhost:8080/api/v1/residents/${formValues.id}`)

      toast.success("Xóa cư dân thành công");

      if (onCloseModal) {
        onCloseModal();
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      if (err.response) {
        const errorData = err.response.data;
        toast.error(`Lỗi: ${errorData.message || "Không thể xóa cư dân"}`);
      } else {
        toast.error("Không thể kết nối đến máy chủ");
      }
      console.error("Chi tiết lỗi:", err);
    }
  };

  // Giữ nguyên hàm validation
  const isFormValid = () => {
    return (
      formValues.name.trim() !== "" &&
      formValues.dob !== "" &&
      formValues.id.trim() !== "" &&
      formValues.gender !== ""
    );
  };

  return (
    <Form width="500px">
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
            options={genderOptions}
          />
        </Form.Fields>
      </FormSection>

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
            options={statusOptions}
          />
        </Form.Fields>
      </FormSection>

      {resident ? (
        <Form.Buttons>
          <Button
            type="button"
            onClick={handleDelete}
            variation="danger"
            size="medium"
          >
            Xóa
            <span>
              <HiTrash />
            </span>
          </Button>
          <Button
            onClick={handleUpdateResident}
            type="button"
            variation="secondary"
            size="medium"
          // disabled={!isFormValid()}
          >
            Cập nhật
            <span>
              <HiPencil />
            </span>
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
        )}
        </ButtonContainer>
    </Form>
  );
}