import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

// Types
interface FeeAndFund {
  id?: string;
  name: string;
  unitPrice: string;
  description: string;
  feeTypeEnum: FeeType;
  createdAt: string;
}

interface FeeAndFundFormProps {
  feeOrFund?: FeeAndFund;
}

type FeeType = "DepartmentFee" | "ContributionFund" | "VehicleFee";

// Constants
const API_ENDPOINTS = {
  fees: "http://localhost:8080/api/v1/fees",
};

const FEE_TYPES: FeeType[] = ["DepartmentFee", "ContributionFund", "VehicleFee"];

// Helper Functions
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Component
export default function FeeAndFundForm({ feeOrFund }: FeeAndFundFormProps) {
  const currentDate = formatDate(new Date());

  const [formValues, setFormValues] = useState<FeeAndFund>({
    id: feeOrFund?.id || "",
    name: feeOrFund?.name || "",
    unitPrice: feeOrFund?.unitPrice || "",
    description: feeOrFund?.description || "",
    feeTypeEnum: feeOrFund?.feeTypeEnum || "DepartmentFee",
    createdAt: feeOrFund?.createdAt || currentDate,
  });

  // Event Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      id: feeOrFund?.id,
      name: formValues.name,
      unitPrice: formValues.unitPrice,
      description: formValues.description,
      feeTypeEnum: formValues.feeTypeEnum,
    };

    try {
      await axios.put(API_ENDPOINTS.fees, data);
      toast.success("Update Successful!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.delete(`${API_ENDPOINTS.fees}/${formValues.id}`);
      toast.success("Delete Successful!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("An error occurred");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formValues.name,
      unitPrice: formValues.feeTypeEnum === "VehicleFee" ? "1" : formValues.unitPrice,
      description: formValues.description,
      feeTypeEnum: formValues.feeTypeEnum,
    };

    try {
      await axios.post(API_ENDPOINTS.fees, data);
      toast.success(`Added ${formValues.name} successfully!`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("An error occurred");
      console.error(err);
    }
  };

  const handleUnitPriceClick = () => {
    if (formValues.feeTypeEnum === "VehicleFee") {
      toast.info(
        "Unit Price is not applicable for VehicleFee. Fees are automatically calculated based on vehicle count (70,000 VND/motorcycle, 1,200,000 VND/car)."
      );
    }
  };

  // Render Methods
  const renderFormFields = () => (
    <>
      <Selector
        value={formValues.feeTypeEnum}
        onChange={handleChange}
        id="feeTypeEnum"
        options={FEE_TYPES}
        label="Type:"
      />

      <FormField>
        <FormField.Label label="Name" />
        <FormField.Input
          id="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
        />
      </FormField>

      <FormField>
        <FormField.Label label="Unit Price" />
        <div onClick={handleUnitPriceClick}>
          <FormField.Input
            id="unitPrice"
            type="text"
            value={formValues.unitPrice}
            onChange={handleChange}
          />
        </div>
      </FormField>

      <FormField>
        <FormField.Label label="Created At" />
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
    </>
  );

  const renderButtons = () =>
    feeOrFund ? (
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
    );

  return (
    <Form width="500px">
      {renderFormFields()}
      {renderButtons()}
    </Form>
  );
}