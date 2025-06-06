import Heading from "../../../components/Heading";
import AddAndSearch from "../../../components/AddAndSearch";
import FeeAndFundTable from "../../../features/fee-and-fund/FeeAndFundTable";
import Row from "../../../components/Row";
import FeeAndFundForm from "../../../features/fee-and-fund/FeeAndFundForm";
import Modal from "../../../components/Modal";
import { useState } from "react";

export default function FeesAndFunds() {
  const [keyword, setKeyword] = useState('');
  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">Phí và Quỹ</Heading>
        <AddAndSearch title="Thêm loại phí" setKeyword={setKeyword} keyword={keyword}>
          <FeeAndFundForm />
        </AddAndSearch>
      </Row>

      <FeeAndFundTable keyword={keyword} />
    </Modal>
  );
}