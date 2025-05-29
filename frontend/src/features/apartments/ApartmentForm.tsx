import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ResidentAddModal from "./ResidentAddModal";
import axios from "axios";
import { toast } from "react-toastify";

interface Resident {
  id: number;
  name: string;
  dob: string;
}

interface Vehicle {
  id: number;
  category: string;
}

interface ApartmentFormProps {
  apartment?: {
    addressNumber: string;
    status: "Business" | "Residential" | "Vacant" | "";
    area: string;
    ownerName: string;
    ownerPhone: string;
    owner: { id: number };
    residentList: Resident[];
    vehicleList: Vehicle[];
  };
  fetchApartments: () => void; // A function to refresh the apartment list after adding a new apartment
}

export default function ApartmentForm({
  apartment,
  fetchApartments,
}: ApartmentFormProps) {
  const [formValues, setFormValues] = useState({
    addressNumber: apartment?.addressNumber || "",
    status: apartment?.status || "",
    area: apartment?.area || "",
    ownerName: apartment?.ownerName || "",
    ownerPhone: apartment?.ownerPhone || "",
    ownerId: apartment?.owner?.id || "",
    memberIds: apartment?.residentList?.map((resident) => resident.id) || [],
  });

  const [selectedResidents, setSelectedResidents] = useState<Resident[]>(
    apartment?.residentList || []
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleResidentsSelect = (newResidents: Resident[]) => {
    // Combine current residents with new residents, removing duplicates by ID
    const updatedResidents = [
      ...selectedResidents,
      ...newResidents.filter(
        (newResident) =>
          !selectedResidents.some(
            (existingResident) => existingResident.id === newResident.id
          )
      ),
    ];

    setSelectedResidents(updatedResidents);

    // Update memberIds for API
    setFormValues((prevValues) => ({
      ...prevValues,
      memberIds: updatedResidents.map((resident) => resident.id),
    }));
  };

  const validateUpdateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validation specifically for update - only validate fields that can be updated
    if (!formValues.area) {
      newErrors.area = "Vui lòng nhập diện tích";
    } else if (isNaN(Number(formValues.area))) {
      newErrors.area = "Diện tích phải là số";
    }

    if (!formValues.status) {
      newErrors.status = "Vui lòng chọn trạng thái";
    }

    if (!formValues.ownerId) {
      newErrors.ownerId = "Vui lòng nhập ID chủ hộ";
    }

    if (!formValues.ownerPhone) {
      newErrors.ownerPhone = "Vui lòng nhập số điện thoại";
    }

    // Set errors to state
    setErrors(newErrors);
    console.log("Update validation errors:", newErrors);

    // Return validation result
    return Object.keys(newErrors).length === 0;
  };

  const extractErrorMessage = (err: any): string => {
    let errorMessage = "Đã có lỗi xảy ra";

    if (err.response) {
      const errorData = err.response.data;
      console.log("Error response structure:", errorData);

      // Extract error message from response
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      else if (errorData && typeof errorData === 'object') {
        // Extract error message in priority order
        errorMessage = errorData.message ||
          errorData.error ||
          (errorData.errors && Array.isArray(errorData.errors) ? errorData.errors.join(", ") : errorData.detail) ||
          JSON.stringify(errorData);
      }

      // Check for specific error messages from updateResident method
      if (errorMessage.includes("is not found")) {
        // Resident not found error
        return `Không tìm thấy cư dân: ${errorMessage}`;
      } else if (errorMessage.includes("Apartment with address number") && errorMessage.includes("not found")) {
        // Apartment not found error
        return `Căn hộ không tồn tại: ${errorMessage}`;
      } else if (errorMessage.includes("Error saving resident")) {
        // General save error
        return `Lỗi khi lưu thông tin cư dân: ${errorMessage.replace("Error saving resident: ", "")}`;
      }

      console.error(`HTTP error ${err.response.status}: ${errorMessage}`);
    } else if (err.request) {
      errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn!";
      console.error("No response received:", err.request);
    } else {
      console.error("Error setting up request:", err.message);
    }

    return errorMessage;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUpdateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        area: formValues.area,
        status: formValues.status,
        ownerId: formValues.ownerId,
        residents: formValues.memberIds,
        ownerPhone: formValues.ownerPhone,
      };
      console.log("Updating apartment with data:", data);

      const response = await axios.put(
        `http://localhost:8080/api/v1/apartments/${formValues.addressNumber}`,
        data
      );

      toast.success("Cập nhật thành công");

      // Kiểm tra fetchApartments tồn tại và là hàm trước khi gọi
      if (typeof fetchApartments === 'function') {
        try {
          fetchApartments();
        } catch (fetchError) {
          console.error("Error refreshing apartment list:", fetchError);
        }
      } else {
        console.log("fetchApartments is not available or not a function, skipping refresh");
      }

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);

      // If there are field-specific errors, update the errors state
      if (err.response?.data?.fieldErrors) {
        const fieldErrors = err.response.data.fieldErrors;
        setErrors(prev => ({
          ...prev,
          ...fieldErrors
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked");

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);

    // Create apartment data object
    const apartmentData = {
      addressNumber: formValues.addressNumber,
      area: formValues.area,
      status: formValues.status,
      ownerId: formValues.ownerId,
      ownerPhone: formValues.ownerPhone,
      memberIds: formValues.memberIds,
    };

    console.log("Sending apartment data:", apartmentData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/apartments",
        apartmentData
      );

      console.log("Response success:", response.data);
      toast.success("Thêm căn hộ thành công");

      // Reset form
      setFormValues({
        addressNumber: "",
        status: "",
        area: "",
        ownerName: "",
        ownerId: "",
        ownerPhone: "",
        memberIds: [],
      });
      setSelectedResidents([]);

      // Kiểm tra fetchApartments tồn tại và là hàm trước khi gọi
      if (typeof fetchApartments === 'function') {
        try {
          fetchApartments();
        } catch (fetchError) {
          console.error("Error refreshing apartment list:", fetchError);
        }
      } else {
        console.log("fetchApartments is not available or not a function, skipping refresh");
      }

      // Delay reload if needed
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error("Error details:", err);

      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);

      // If there are field-specific errors, update the errors state
      if (err.response?.data?.fieldErrors) {
        const fieldErrors = err.response.data.fieldErrors;
        setErrors(prev => ({
          ...prev,
          ...fieldErrors
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formValues.addressNumber.trim()) {
      newErrors.addressNumber = "Vui lòng nhập số căn hộ";
    }

    if (!formValues.area.trim()) {
      newErrors.area = "Vui lòng nhập diện tích";
    } else if (isNaN(Number(formValues.area))) {
      newErrors.area = "Diện tích phải là số";
    }

    if (!formValues.status) {
      newErrors.status = "Vui lòng chọn trạng thái";
    }

    // Only check ownerId instead of ownerName
    if (!formValues.ownerId) {
      newErrors.ownerId = "Vui lòng nhập ID chủ hộ";
    }

    if (!formValues.ownerPhone.trim()) {
      newErrors.ownerPhone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formValues.ownerPhone)) {
      newErrors.ownerPhone = "Số điện thoại không hợp lệ";
    }

    // Set errors to state - important!
    setErrors(newErrors);
    console.log("Validation errors:", newErrors);

    // Return validation result
    return Object.keys(newErrors).length === 0;
  };

  const statusOptions = ["Business", "Residential"];

  return (
    <Form width="800px">
      <label>Căn hộ:</label>
      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Mã căn hộ" />
          <FormField.Input
            id="addressNumber"
            type="text"
            value={formValues.addressNumber}
            onChange={handleChange}
            required
            disabled={!!apartment} // Disable if editing existing apartment
          />
          {!apartment && errors.addressNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.addressNumber}</p>)}
        </FormField>

        <FormField>
          <FormField.Label label="Diện tích" />
          <FormField.Input
            id="area"
            type="text"
            value={formValues.area}
            onChange={handleChange}
            required
          />
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area}</p>
          )}
        </FormField>
      </Form.Fields>

      <Selector
        id="status"
        value={formValues.status}
        onChange={handleChange}
        options={statusOptions}
        label="Trạng thái"
      />
      {errors.status && (
        <p className="text-red-500 text-sm mt-1">{errors.status}</p>
      )}

      <label>Chủ hộ:</label>
      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="CCCD" />
          <FormField.Input
            id="ownerId"
            type="text"
            value={formValues.ownerId}
            onChange={handleChange}
            required
          />
          {errors.ownerId && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerId}</p>
          )}
        </FormField>
        <FormField>
          <FormField.Label label="Sđt" />
          <FormField.Input
            id="ownerPhone"
            type="text"
            value={formValues.ownerPhone}
            onChange={handleChange}
            required
          />
          {errors.ownerPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>
          )}
        </FormField>
      </Form.Fields>

      <label>Thành viên:</label>
      <Table columns="1fr 1fr">
        <Table.Header size="small">
          <div>Tên</div>
          <div>Ngày sinh</div>
        </Table.Header>
        {selectedResidents.map((resident) => (
          <Table.Row size="small" key={resident.id}>
            <div>{resident.name}</div>
            <div>{resident.dob}</div>
          </Table.Row>
        ))}
      </Table>

      <Modal>
        <Modal.Open id="openAddResident">
          <Button type="button" variation="secondary" size="small">
            Thêm thành viên
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Modal.Open>

        <Modal.Window id="openAddResident" name="Add Residents">
          <ResidentAddModal onResidentsSelect={handleResidentsSelect} />
        </Modal.Window>
      </Modal>

      {apartment?.vehicleList && (
        <>
          <label>Phương tiện:</label>
          <Table columns="1fr 1fr">
            <Table.Header size="small">
              <div>Biển số xe</div>
              <div>Loại xe</div>
            </Table.Header>
            {apartment.vehicleList.map((vehicle) => (
              <Table.Row size="small" key={vehicle.id}>
                <div>{vehicle.id}</div>
                <div>{vehicle.category}</div>
              </Table.Row>
            ))}
          </Table>
        </>
      )}

      {/* Hiển thị lỗi chung nếu có */}
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      {/* Action Buttons */}
      {apartment ? (
        <Form.Buttons>
          <Button
            onClick={handleUpdate}
            type="button"
            variation="secondary"
            size="medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
            <span>
              <HiPencil />
            </span>
          </Button>
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button
            onClick={(e) => {
              console.log("Add button clicked");
              // Force validation before submission
              const isValid = validateForm();
              console.log("Form validation result:", isValid, errors);
              if (isValid) {
                handleSubmit(e);
              }
            }}
            type="button"
            size="medium"
            variation="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Lưu"}
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}