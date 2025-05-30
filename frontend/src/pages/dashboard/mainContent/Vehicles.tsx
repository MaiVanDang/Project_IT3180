import { useState } from "react";
import styled from "styled-components";
import AddAndSearch from "../../../components/AddAndSearch";
import Heading from "../../../components/Heading";
import VehiclesTable from "../../../features/vehicles/VehiclesTable";
import VehicleForm from "../../../features/vehicles/VehicleForm";
import VehicleSearchForm from "../../../features/vehicles/VehicleSearchFrom";
import Button from "../../../components/Button";
import { HiOutlineAdjustmentsHorizontal, HiXMark, HiPlus } from "react-icons/hi2";

const PageContainer = styled.div`
  padding: 2rem;
  background-color: var(--color-grey-50);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const AdvancedSearchContainer = styled.div<{ $isOpen: boolean }>`
  margin-bottom: 2rem;
  padding: ${({ $isOpen }) => ($isOpen ? "1.5rem" : "0")};
  border-radius: 12px;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-sm);
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const FilterButton = styled(Button) <{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ $active }) =>
    $active ? "var(--color-primary-600)" : "var(--color-grey-100)"};
  color: ${({ $active }) =>
    $active ? "var(--color-grey-0)" : "var(--color-grey-700)"};
  
  &:hover {
    background-color: ${({ $active }) =>
    $active ? "var(--color-primary-700)" : "var(--color-grey-200)"};
  }
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default function Vehicles() {
  // Giữ nguyên tất cả các state và logic xử lý
  const [keyword, setKeyword] = useState("");
  const [filterString, setFilterString] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Giữ nguyên hàm xử lý tìm kiếm
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
    <PageContainer>
      <HeaderContainer>
        <TitleContainer>
          <Heading as="h1">Quản lý phương tiện</Heading>
        </TitleContainer>

        <ActionContainer>
          <AddAndSearch
            title="Thêm phương tiện"
            placeholder="Tìm theo tên cư dân, biển số xe..."
            setKeyword={handleBasicSearch}
            keyword={keyword}
            renderButton={(open) => (
              <AddButton
                variation="primary"
                size="medium"
                onClick={open}
              >
                <HiPlus /> Thêm mới
              </AddButton>
            )}
          >
            <VehicleForm />
          </AddAndSearch>

          <FilterButton
            variation={showAdvancedSearch ? "primary" : "secondary"}
            size="medium"
            onClick={toggleAdvancedSearch}
            $active={showAdvancedSearch}
          >
            {showAdvancedSearch ? (
              <>
                <HiXMark /> Đóng bộ lọc
              </>
            ) : (
              <>
                <HiOutlineAdjustmentsHorizontal /> Bộ lọc nâng cao
              </>
            )}
          </FilterButton>
        </ActionContainer>
      </HeaderContainer>

      <AdvancedSearchContainer $isOpen={showAdvancedSearch}>
        {showAdvancedSearch && (
          <VehicleSearchForm onSearch={handleAdvancedSearch} />
        )}
      </AdvancedSearchContainer>

      {/* Giữ nguyên props truyền vào VehiclesTable */}
      <VehiclesTable filterString={filterString} keyword={keyword} />
    </PageContainer>
  );
}