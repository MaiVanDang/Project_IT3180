import Table from "../../components/Table";
import ResidentRow from "./ResidentRow";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";

interface ResidentsTableProps {
  keyword: string;
  filterString?: string;
}

export default function ResidentsTable({ keyword, filterString = "" }: ResidentsTableProps) {
  const [residents, setResidents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiResidents = async (page: number = 1) => {
    try {
      setIsLoading(true);

      // Xác định filter dựa trên tìm kiếm đơn giản hoặc nâng cao
      let filter = "";

      // Ưu tiên sử dụng filterString từ tìm kiếm nâng cao nếu có
      if (filterString) {
        filter = filterString;
      }
      // Nếu không có filterString nhưng có keyword, tạo filter đơn giản
      else if (keyword) {
        filter = `name~'*${keyword}*'`;
      }

      const response = await axios.get(
        // `http://localhost:8080/api/v1/residents?size=10&page=${page}${filter ? `&filter=${filter}` : ""}`
        `http://localhost:8080/api/v1/residents/all?size=10&page=${page}${filter ? `&filter=${filter}` : ""}`
      );

      setResidents(response.data.data.result);
      setTotalPages(response.data.data.totalPages);
      setTotalElements(response.data.data.totalElements);
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset về trang 1 khi thay đổi điều kiện tìm kiếm
    if (curPage !== 1) {
      setCurPage(1);
    } else {
      apiResidents(1);
    }
  }, [keyword, filterString]);

  useEffect(() => {
    apiResidents(curPage);
  }, [curPage]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  return (
    <>
      <Table columns="0.5fr 1fr 1.5fr 1.5fr 1fr 1.5fr 1fr 1fr">
        <Table.Header>
          <div>STT</div>
          <div>Căn hộ</div>
          <div>Họ tên</div>
          <div>CCCD</div>
          <div>Giới tính</div>
          <div>Ngày sinh</div>
          <div>Trạng thái</div>
          <div>Hành động</div>
        </Table.Header>

        {isLoading ? (
          <Table.Row>
            <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>Loading...</div>
          </Table.Row>
        ) : residents.length > 0 ? (
          residents.map((resident, index) => (
            <ResidentRow
              key={resident.id}
              resident={resident}
              index={(curPage - 1) * 10 + index}
            />
          ))
        ) : (
          <Table.Row>
            <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              Không tìm thấy cư dân nào phù hợp với tiêu chí tìm kiếm
            </div>
          </Table.Row>
        )}

        <Table.Footer>
          <Pagination
            totalPages={totalPages}
            curPage={curPage}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </Table.Footer>
      </Table>
    </>
  );
}