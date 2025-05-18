import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResidentForm({ resident, onCloseModal }: any) {
  const [formValues, setFormValues] = useState({
    id: resident?.id || "",
    name: resident?.name || "",
    dob: resident?.dob || "",
    apartmentId: resident?.apartmentId || "",
    status: resident?.status || "Resident",
    cic: resident?.cic || "",
    gender: resident?.gender || "",
  });

  const statusOptions = ["Resident", "Moved", "Temporary", "Absent"];
  const genderOptions = ["Male", "Female"];

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

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

      if (onCloseModal) {
        onCloseModal();
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err: any) {
      // Xử lý lỗi chi tiết từ backend
      if (err.response) {
        // Có phản hồi từ server
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
        // Lỗi khi thiết lập request
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu!");
      }
      console.error("Chi tiết lỗi:", err);
    }
  };

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
      // Xử lý lỗi chi tiết từ backend
      if (err.response) {
        const errorData = err.response.data;
        toast.error(`Lỗi: ${errorData.message || "Không thể xóa cư dân"}`);
      } else if (err.request) {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!");
      } else {
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu!");
      }
      console.error("Chi tiết lỗi:", err);
    }
  }

  // Kiểm tra dữ liệu trước khi submit
  const isFormValid = () => {
    return (
      formValues.name.trim() !== "" &&
      formValues.dob !== "" &&
      formValues.id.trim() !== "" &&
      formValues.gender !== ""
    );
  };

  return (
    <Form width="400px">
      <div>
        <label>Thông tin cư dân:</label>
        <Form.Fields>
          <FormField>
            <FormField.Label label={"Họ tên"} />
            <FormField.Input
              id="name"
              type="name"
              value={formValues.name}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <FormField.Label label={"Ngày sinh"} />
            <FormField.Input
              id="dob"
              type="date"
              value={formValues.dob}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <FormField.Label label={"CCCD/CMND"} />
            <FormField.Input
              id="id"
              type="text"
              value={formValues.id}
              onChange={handleChange}
              required
            />
          </FormField>
          <Selector
            value={formValues.gender}
            onChange={handleChange}
            id="gender"
            options={genderOptions}
            label={"Giới tính:"}
          ></Selector>
        </Form.Fields>
      </div>
      <div>
        <label>Thông tin căn hộ:</label>
        <Form.Fields>
          <FormField>
            <FormField.Label label={"Mã căn hộ"} />
            <FormField.Input
              id="apartmentId"
              type="search"
              value={formValues.apartmentId}
              onChange={handleChange}
              placeholder="Để trống nếu không thuộc căn hộ nào"
            />
          </FormField>

          <FormField>
            <FormField.Label label={"Trạng thái"} />
            <FormField.Select
              id="status"
              options={statusOptions}
              value={formValues.status}
              onChange={handleChange}
            />
          </FormField>
        </Form.Fields>
      </div>

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
          {/* <Button type="button" variation="secondary" size="medium">
            Cập nhật
            <span>
              <HiPencil />
            </span>
          </Button> */}
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
            Thêm
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}