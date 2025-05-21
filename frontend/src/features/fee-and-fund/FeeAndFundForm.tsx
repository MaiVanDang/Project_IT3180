import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

// Hàm định dạng ngày thành dd/mm/yyyy
const formatDate = (date: any) => {
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm số 0 nếu cần
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0 nên +1)
  const year = date.getFullYear(); // Lấy năm
  return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
};

export default function FeeAndFundForm({ feeOrFund }: any) {
  // Lấy ngày hiện tại động từ hệ thống
  const currentDate = new Date(); // Sử dụng thời điểm hiện tại thực tế
  const formattedCurrentDate = formatDate(currentDate);

  const [formValues, setFormValues] = useState({
    id: feeOrFund?.id || "",
    name: feeOrFund?.name || "",
    unitPrice: feeOrFund?.unitPrice || "",
    description: feeOrFund?.description || "",
    feeTypeEnum: feeOrFund?.feeTypeEnum || "",
    createdAt: feeOrFund?.createdAt || formattedCurrentDate,
  });
  const typeOptions = ["DepartmentFee", "ContributionFund", "VehicleFee"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const data = {
      id: feeOrFund.id,
      name: formValues.name,
      unitPrice: formValues.unitPrice,
      description: formValues.description,
      feeTypeEnum: formValues.feeTypeEnum,
    }

    try {
      const response = await axios.put("http://localhost:8080/api/v1/fees", data);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      toast.success("Update Successfull!")
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  }

  const handleUnitPriceClick = () => {
    if (formValues.feeTypeEnum === "VehicleFee") {
      alert("Unit Price không áp dụng cho VehicleFee, phí được tính tự động dựa trên số lượng xe (70.000 VND/xe máy, 1.200.000 VND/ô tô).");
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      // Xoá Fee-Fund theo ID
      const response = await axios.delete(`http://localhost:8080/api/v1/fees/${formValues.id}`);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      toast.success("Delete Sucessfull!!");
    } catch (err) {
      toast.error("Có lỗi xảy ra");
      console.log(err);
    }

  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(formValues);

    const data = {
      name: formValues.name,
      unitPrice: formValues.feeTypeEnum === "VehicleFee" ? "1" : formValues.unitPrice,
      description: formValues.description,
      feeTypeEnum: formValues.feeTypeEnum,
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/fees", data);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      toast.success(`Add ${formValues.name} Successfull!`);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form width="500px">
      <Selector
        value={formValues.feeTypeEnum}
        onChange={handleChange}
        id="feeTypeEnum"
        options={typeOptions}
        label={"Type:"}
      ></Selector>

      <FormField>
        <FormField.Label label={"Name"} />
        <FormField.Input
          id="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
        />
      </FormField>

      <FormField>
        <FormField.Label label={"Unit Price"} />
        <div onClick={handleUnitPriceClick}>
          <FormField.Input
            id="unitPrice"
            type="text"
            value={formValues.unitPrice}
            onChange={handleChange}
          // readOnly={formValues.feeTypeEnum === "VehicleFee"}
          />
        </div>
      </FormField>

      <FormField>
        <FormField.Label label={"Created At"} />
        <FormField.Input
          id="createdAt"
          type="text"
          value={formValues.createdAt}
          onChange={handleChange}
          readOnly
        />
      </FormField>

      <label>Description: </label>
      <Form.TextArea
        id="description"
        value={formValues.description}
        onChange={handleChange}
      />

      {feeOrFund ? (
        <Form.Buttons>
          <Button variation="danger" size="medium" onClick={handleDelete}>
            Delete
            <span>
              <HiTrash />
            </span>
          </Button>
          <Button variation="secondary" size="medium" onClick={handleUpdate}>
            Update
            <span>
              <HiPencil />
            </span>
          </Button>
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button size="medium" variation="primary" onClick={handleSubmit}>
            Add
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}
