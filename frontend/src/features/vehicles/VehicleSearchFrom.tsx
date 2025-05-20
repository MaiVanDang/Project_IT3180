import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

export default function VehicleSearchForm({ onSearch }: { onSearch: (filters: string) => void }) {
    const [searchParams, setSearchParams] = useState({
        apartmentID: "",
        category: "",
        registerDate: "",
        id: "",
    });

    const vehicleTypeOptions = ["", "Motorbike", "Car"];
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        // Tạo chuỗi filter dựa trên Spring Filter syntax
        let filterString = "";
        const filters = [];
        if (searchParams.apartmentID) {
            filters.push(`apartmentID:'${searchParams.apartmentID}'`); // Tìm chính xác mã căn hộ
        }
        if (searchParams.category) {
            filters.push(`category:'${searchParams.category}'`); // Tìm chính xác loại xe
        }
        if (searchParams.registerDate) {
            filters.push(`registerDate:'${searchParams.registerDate}'`); // Tìm chính xác ngày đăng ký
        }
        if (searchParams.id) {
            filters.push(`id:'${searchParams.id}'`); // Tìm chính xác mã phương tiện
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
            apartmentID: "",
            category: "",
            registerDate: "",
            id: "",
        });
        onSearch("");
    };

    return (
        <Form width="100%">
            <div className="flex-1 min-w-60">
                <FormField>
                    <FormField.Label label={"Biển số xexe"} />
                    <FormField.Input
                        id="apartmentID"
                        type="text"
                        value={searchParams.apartmentID}
                        onChange={handleChange}
                        placeholder="Tìm theo biển số xexe"
                    />
                </FormField>
            </div>

            <div className="flex-1 min-w-60">
                <FormField>
                    <FormField.Label label={"Loại xe"} />
                    <FormField.Select
                        id="category"
                        value={searchParams.category}
                        onChange={handleChange}
                        options={vehicleTypeOptions}
                    />
                </FormField>
            </div>

            <div className="flex-1 min-w-60">
                <FormField>
                    <FormField.Label label={"Ngày đăng ký"} />
                    <FormField.Input
                        id="registerDate"
                        type="date"
                        value={searchParams.registerDate}
                        onChange={handleChange}
                    />
                </FormField>
            </div>

            <div className="flex-1 min-w-60">
                <FormField>
                    <FormField.Label label={"Mã phương tiện"} />
                    <FormField.Input
                        id="id"
                        type="text"
                        value={searchParams.id}
                        onChange={handleChange}
                        placeholder="Tìm theo mã phương tiện"
                    />
                </FormField>
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