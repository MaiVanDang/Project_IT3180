import styled, { css } from "styled-components";
import React, { createContext, useContext, ReactNode, ReactElement } from "react";

// Types
interface CommonRowProps {
  columns?: string;
  size?: SizeType;
}

interface TableProps {
  columns: string;
  children: ReactNode;
}

interface HeaderProps {
  size?: SizeType;
  children: ReactNode;
}

interface RowProps {
  size?: SizeType;
  children: ReactNode;
}

interface BodyProps<T> {
  data: T[];
  render: (item: T, index: number) => ReactElement;
}

type SizeType = "small" | "normal";

// Styled Components
const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: 14px;
  font-size: 14px;
  background-color: var(--color-grey-0);
  overflow: hidden;
  text-align: center;
`;

const CommonRow = styled.div<CommonRowProps>`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 24px;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)<CommonRowProps>`
  ${({ size }) =>
    size === "small"
      ? css`
          padding: 4px 24px;
        `
      : css`
          padding: 12px 24px;
        `}

  background-color: var(--color-grey-700);
  border-bottom: 1px solid var(--color-grey-100);
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-0);
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;

const StyledRow = styled(CommonRow)<CommonRowProps>`
  ${({ size }) =>
    size === "small"
      ? css`
          padding: 4px 24px;
        `
      : css`
          padding: 12px 24px;
        `}

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 4px 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-0);
  color: var(--color-grey-0);
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  display: flex;
  justify-content: center;

  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin: 24px;
`;

// Context
const TableContext = createContext<{ columns?: string }>({});

// Component
const Table = ({ columns, children }: TableProps) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table" as="header">
        {children}
      </StyledTable>
    </TableContext.Provider>
  );
};

// Sub-components
const Header = ({ children, size = "normal" }: HeaderProps) => {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" columns={columns} size={size}>
      {children}
    </StyledHeader>
  );
};

const Row = ({ children, size = "normal" }: RowProps) => {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns} size={size}>
      {children}
    </StyledRow>
  );
};

const Body = <T,>({ data, render }: BodyProps<T>) => {
  if (!data.length) {
    return <Empty>No data at the moment</Empty>;
  }
  return <StyledBody>{data.map(render)}</StyledBody>;
};

// Component composition
Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;