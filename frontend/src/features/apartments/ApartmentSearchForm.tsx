import { useState, ChangeEvent, FormEvent } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

// Types
interface SearchParams {
  addressNumber: string;
  ownerName: string;
  ownerPhone: string;
  status: ApartmentStatus;
}

interface ApartmentSearchFormProps {
  onSearch: (filters: string) => void;
}

type ApartmentStatus = "Business" | "Residential" | "Vacant" | "";

// Constants
const STATUS_OPTIONS: ApartmentStatus[] = ["Business", "Residential", "Vacant", ""];

const INITIAL_SEARCH_PARAMS: SearchParams = {
  addressNumber: "",
  ownerName: "",
  ownerPhone: "",
  status: "",
};

// Component
export default function ApartmentSearchForm({ onSearch }: ApartmentSearchFormProps) {
  // State
  const [searchParams, setSearchParams] = useState<SearchParams>(INITIAL_SEARCH_PARAMS);

  // Event Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const filterString = buildFilterString();
    onSearch(filterString);
  };

  const handleClear = () => {
    setSearchParams(INITIAL_SEARCH_PARAMS);
    onSearch("");
  };

  // Helper Methods
  const buildFilterString = (): string => {
    const filters: string[] = [];

    if (searchParams.addressNumber) {
      filters.push(`addressNumber~'*${searchParams.addressNumber}*'`);
    }

    if (searchParams.ownerName) {
      filters.push(`cic:'${searchParams.ownerName}'`);
    }

    if (searchParams.status) {
      filters.push(`status:'${searchParams.status}'`);
    }

    if (searchParams.ownerPhone) {
      filters.push(`apartmentId:${searchParams.ownerPhone}`);
    }

    return filters.length > 0 ? filters.join(" and ") : "";
  };

  // Render Methods
  const renderSearchField = (
    id: keyof SearchParams,
    label: string,
    placeholder: string,
    type: "text" | "select" = "text"
  ) => (
    <div className="flex-1 min-w-60">
      <FormField>
        <FormField.Label label={label} />
        {type === "select" ? (
          <FormField.Select
            id={id}
            options={STATUS_OPTIONS}
            value={searchParams[id]}
            onChange={handleChange}
            placeholder={placeholder}
          />
        ) : (
          <FormField.Input
            id={id}
            type="text"
            value={searchParams[id]}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )}
      </FormField>
    </div>
  );

  const renderButtons = () => (
    <Form.Buttons>
      <Button
        onClick={handleClear}
        size="medium"
        variation="secondary"
        type="button"
      >
        Xóa bộ lọc
        <span>
          <HiXMark />
        </span>
      </Button>

      <Button
        onClick={handleSubmit}
        size="medium"
        variation="primary"
        type="submit"
      >
        Tìm kiếm
        <span>
          <HiMagnifyingGlass />
        </span>
      </Button>
    </Form.Buttons>
  );

  return (
    <Form width="100%">
      <div className="flex flex-wrap gap-4">
        {renderSearchField(
          "addressNumber",
          "Mã căn hộ",
          "Tìm theo mã căn hộ"
        )}
        {renderSearchField(
          "ownerName",
          "Tên chủ hộ",
          "Tìm theo tên chủ sở hữu"
        )}
        {renderSearchField(
          "ownerPhone",
          "Sđt",
          "Tìm theo số điện thoại"
        )}
        {renderSearchField(
          "status",
          "Trạng thái",
          "Tất cả trạng thái",
          "select"
        )}
      </div>
      {renderButtons()}
    </Form>
  );
}