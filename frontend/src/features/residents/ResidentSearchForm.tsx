import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

export default function ResidentSearchForm({ onSearch }: { onSearch: (filters: string) => void }) {
  const [searchParams, setSearchParams] = useState({
    name: "",
    cic: "",
    status: "",
    apartmentId: "",
  });

  const statusOptions = ["", "Resident", "Temporary", "Absent"];

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
    
    if (searchParams.name) {
      filters.push(`name~'*${searchParams.name}*'`); // Tìm kiếm mờ với *
    }
    
    if (searchParams.cic) {
      filters.push(`cic:'${searchParams.cic}'`); // Tìm chính xác CCCD/CMND
    }
    
    if (searchParams.status) {
      filters.push(`status:'${searchParams.status}'`);
    }
    
    if (searchParams.apartmentId) {
      filters.push(`apartmentId:${searchParams.apartmentId}`);
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
      name: "",
      cic: "",
      status: "",
      apartmentId: "",
    });
    
    // Gọi callback với chuỗi filter rỗng để lấy tất cả dữ liệu
    onSearch("");
  };

  return (
    <Form width="100%">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"Họ tên"} />
            <FormField.Input
              id="name"
              type="text"
              value={searchParams.name}
              onChange={handleChange}
              placeholder="Tìm theo họ tên"
            />
          </FormField>
        </div>
        
        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"CCCD/CMND"} />
            <FormField.Input
              id="cic"
              type="text"
              value={searchParams.cic}
              onChange={handleChange}
              placeholder="Tìm theo CCCD/CMND"
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
        
        <div className="flex-1 min-w-60">
          <FormField>
            <FormField.Label label={"Mã căn hộ"} />
            <FormField.Input
              id="apartmentId"
              type="text"
              value={searchParams.apartmentId}
              onChange={handleChange}
              placeholder="Tìm theo mã căn hộ"
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