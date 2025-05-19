import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import AddAndSearch from "../../../components/AddAndSearch";
import ApartmentsTable from "../../../features/apartments/ApartmentsTable";
import ApartmentForm from "../../../features/apartments/ApartmentForm";
import ApartmentSearchForm from "../../../features/apartments/ApartmentSearchForm";
import { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { HiOutlineAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";

const StyledRow = styled(Row)`
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

export default function Apartments() {
  const [keyword, setKeyword] = useState('');
  const [filterString, setFilterString] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Xử lý tìm kiếm nâng cao
  const handleAdvancedSearch = (filters) => {
    setFilterString(filters);
    if (filters) setKeyword(''); // Xóa keyword để tránh xung đột
  };
  // Xử lý từ tìm kiếm cơ bản
  const handleBasicSearch = (value) => {
    setKeyword(value);
    setFilterString(''); // Xóa filter string khi dùng tìm kiếm cơ bản
  };

  // Toggle hiển thị form tìm kiếm nâng cao
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch((prev) => !prev);
    
    // Nếu đóng form tìm kiếm nâng cao và không có keyword, reset filterString
    if (showAdvancedSearch && !keyword) {
      setFilterString('');
    }
  };

  return (
    <>
      <StyledRow type="horizontal" showForm={showAdvancedSearch}>
        <Heading as="h1">Quản lý căn hộ</Heading>
        <div style={{ display: "flex", alignItems: "center" }}>
          <AddAndSearch 
            title="Thêm căn hộ" 
            setKeyword={handleBasicSearch} 
            keyword={keyword}
          >
            <ApartmentForm />
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
          <ApartmentSearchForm onSearch={handleAdvancedSearch} />
        </AdvancedSearchContainer>
      )}

      <ApartmentsTable keyword={keyword} filterString={filterString}/>
    </>
  );
}