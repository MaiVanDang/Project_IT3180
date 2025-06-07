import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil } from "react-icons/hi2";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ResidentAddModal from "./ResidentAddModal";
import axios from "axios";
import { toast } from "react-toastify";

// Types
interface Resident {
  id: number;
  name: string;
  dob: string;
}

interface Vehicle {
  id: number;
  category: string;
}

interface ApartmentFormValues {
  addressNumber: string;
  status: ApartmentStatus;
  area: string;
  ownerName: string;
  ownerPhone: string;
  ownerId: string | number;
  memberIds: number[];
}

type ApartmentStatus = "Business" | "Residential" | "Vacant" | "";

interface ApartmentFormProps {
  apartment?: {
    addressNumber: string;
    status: ApartmentStatus;
    area: string;
    ownerName: string;
    ownerPhone: string;
    owner: { id: number };
    residentList: Resident[];
    vehicleList: Vehicle[];
  };
  fetchApartments: () => void;
}

interface FormErrors {
  [key: string]: string;
}

// Constants
const API_ENDPOINTS = {
  apartments: "http://localhost:8080/api/v1/apartments",
};

const STATUS_OPTIONS: ApartmentStatus[] = ["Business", "Residential"];
const PHONE_REGEX = /^[0-9]{10,11}$/;

// Component
export default function ApartmentForm({
  apartment,
  fetchApartments,
}: ApartmentFormProps) {
  // State
  const [formValues, setFormValues] = useState<ApartmentFormValues>({
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Event Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
    clearFieldError(id);
  };

  const handleResidentsSelect = (newResidents: Resident[]) => {
    const updatedResidents = [
      ...selectedResidents,
      ...newResidents.filter(
        (newRes) => !selectedResidents.some((existingRes) => existingRes.id === newRes.id)
      ),
    ];

    setSelectedResidents(updatedResidents);
    setFormValues((prev) => ({
      ...prev,
      memberIds: updatedResidents.map((res) => res.id),
    }));
  };

  // Validation Methods
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (!formValues.ownerId) {
      newErrors.ownerId = "Vui lòng nhập ID chủ hộ";
    }

    if (!formValues.ownerPhone.trim()) {
      newErrors.ownerPhone = "Vui lòng nhập số điện thoại";
    } else if (!PHONE_REGEX.test(formValues.ownerPhone)) {
      newErrors.ownerPhone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpdateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper Methods
  const clearFieldError = (fieldId: string) => {
    if (errors[fieldId]) {
      setErrors((prev) => {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
    if (typeof fetchApartments === 'function') {
      fetchApartments().catch(console.error);
    }
    setTimeout(() => window.location.reload(), 1500);
  };

  const extractErrorMessage = (err: any): string => {
    if (err.response?.data) {
      const errorData = err.response.data;
      return typeof errorData === 'string' 
        ? errorData 
        : errorData.message || "Đã có lỗi xảy ra";
    }
    return err.message || "Đã có lỗi xảy ra";
  };

  // Submit Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(API_ENDPOINTS.apartments, {
        addressNumber: formValues.addressNumber,
        area: formValues.area,
        status: formValues.status,
        ownerId: formValues.ownerId,
        ownerPhone: formValues.ownerPhone,
        memberIds: formValues.memberIds,
      });

      handleSuccess("Thêm căn hộ thành công");
      resetForm();
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
      handleFieldErrors(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUpdateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.put(
        `${API_ENDPOINTS.apartments}/${formValues.addressNumber}`,
        {
          area: formValues.area,
          status: formValues.status,
          ownerId: formValues.ownerId,
          residents: formValues.memberIds,
          ownerPhone: formValues.ownerPhone,
        }
      );

      handleSuccess("Cập nhật thành công");
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
      handleFieldErrors(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Methods
  const renderResidentTable = () => (
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
  );

  const renderVehicleTable = () => (
    apartment?.vehicleList && (
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
    )
  );

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
      {renderResidentTable()}

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

      {renderVehicleTable()}

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