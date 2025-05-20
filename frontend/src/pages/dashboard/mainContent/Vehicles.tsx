import { useState } from "react";
import styled from "styled-components";

import AddAndSearch from "../../../components/AddAndSearch";
import Heading from "../../../components/Heading";
import Row from "../../../components/Row";
import VehiclesTable from "../../../features/vehicles/VehiclesTable";
import VehicleForm from "../../../features/vehicles/VehicleForm";
import VehicleSearchForm from "../../../features/vehicles/VehicleSearchFrom";
import Button from "../../../components/Button";

import { HiOutlineAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";

const StyledRow = styled(Row)<{ showForm: boolean }>`
  margin-bottom: ${(props) => (props.showForm ? "0" : "2rem")};
`;

const AdvancedSearchContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.2rem 2.4rem;
  border-radius: 8px;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FilterButtonContainer = styled.div`
  margin-left: 1rem;
`;

export default function Vehicles() {
  const [keyword, setKeyword] = useState("");
  const [filterString, setFilterString] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleAdvancedSearch = (filters: string) => {
    setFilterString(filters);
    if (filters) setKeyword("");
  };

  const handleBasicSearch = (value: string) => {
    setKeyword(value);
    setFilterString("");
  };

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch((prev) => {
      const next = !prev;
      if (!next && !keyword) setFilterString("");
      return next;
    });
  };

  return (
    <>
      <StyledRow type="horizontal" showForm={showAdvancedSearch}>
        <Heading as="h1">Quản lý phương tiện</Heading>
        <div style={{ display: "flex", alignItems: "center" }}>
          <AddAndSearch
            title="Thêm phương tiện"
            placeholder="Tìm theo tên cư dân, biển số xe..."
            setKeyword={handleBasicSearch}
            keyword={keyword}
          >
            <VehicleForm />
          </AddAndSearch>

          <FilterButtonContainer>
            <Button
              variation={showAdvancedSearch ? "primary" : "secondary"}
              size="small"
              onClick={toggleAdvancedSearch}
            >
              {showAdvancedSearch ? (
                <>
                  Đóng bộ lọc <HiXMark />
                </>
              ) : (
                <>
                  Bộ lọc <HiOutlineAdjustmentsHorizontal />
                </>
              )}
            </Button>
          </FilterButtonContainer>
        </div>
      </StyledRow>

      {showAdvancedSearch && (
        <AdvancedSearchContainer>
          <VehicleSearchForm onSearch={handleAdvancedSearch} />
        </AdvancedSearchContainer>
      )}

      <VehiclesTable filterString={filterString} keyword={keyword} />
    </>
  );
}
