import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

export default function ResidentSearchForm({ onSearch }: { onSearch: (filters: string) => void }) {
  const [searchParams, setSearchParams] = useState({
    addressNumber: "",
    ownerName: "",
    ownerPhone: "",
    status: "",
  });

  const statusOptions = ["Business", "Residential", "Vacant", ""];

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Tạo chuỗi filter dựa trên Spring Filter syntax
    let filterString = "";
    const filters = [];

    if (searchParams.addressNumber) {
      filters.push(`addressNumber~'*${searchParams.addressNumber}*'`); // Tìm kiếm mờ với *
    }

    if (searchParams.ownerName) {
      filters.push(`cic:'${searchParams.ownerName}'`); // Tìm chính xác tên chủ sở hữu
    }

    if (searchParams.status) {
      filters.push(`status:'${searchParams.status}'`);
    }

    if (searchParams.ownerPhone) {
      filters.push(`apartmentId:${searchParams.ownerPhone}`); // Tìm chính xác số điện thoại
    }

    // Kết hợp các điều kiện bằng AND
    if (filters.length > 0) {
      filterString = filters.join(" and ");
    }

    // Gọi callback với chuỗi filter
    onSearch(filterString);
  };

  const handleClear = () => {
    setSearchParams({
      addressNumber: "",
      ownerName: "",
      ownerPhone: "",
      status: "",
    });

    // Gọi callback với chuỗi filter rỗng để lấy tất cả dữ liệu
    onSearch("");
  };

  return (
    <Form width="100%">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"Mã căn hộ"} />
            <FormField.Input
              id="addressNumber"
              type="text"
              value={searchParams.addressNumber}
              onChange={handleChange}
              placeholder="Tìm theo mã căn hộ"
            />
          </FormField>
        </div>

        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"Tên chủ hộ"} />
            <FormField.Input
              id="ownerName"
              type="text"
              value={searchParams.ownerName}
              onChange={handleChange}
              placeholder="Tìm theo tên chủ sở hữu"
            />
          </FormField>
        </div>

        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"Sđt"} />
            <FormField.Input
              id="ownerPhone"
              type="text"
              value={searchParams.ownerPhone}
              onChange={handleChange}
              placeholder="Tìm theo số điện thoại"
            />
          </FormField>
        </div>

        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"Trạng thái"} />
            <FormField.Select
              id="status"
              options={statusOptions}
              value={searchParams.status}
              onChange={handleChange}
              placeholder="Tất cả trạng thái"
            />
          </FormField>
        </div>
      </div>

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
    </Form>
  );
}