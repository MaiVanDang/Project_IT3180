import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import styled, { css } from "styled-components";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

// Types
interface PaginationProps {
  totalPages: number;
  curPage: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

interface PaginationButtonProps {
  buttonStyle: "numb" | "btn";
  isActive: boolean;
}

// Styled Components
const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #fff;
  padding: 8px;
  border-radius: 10px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 6px;
`;

const PaginationButton = styled.button<PaginationButtonProps>`
  color: var(--color-grey-700);
  line-height: 45px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover:not(:disabled) {
    color: #fff;
    background: var(--color-grey-700);
  }

  &:active:not(:disabled) {
    color: #fff;
    background: var(--color-grey-700);
  }

  ${(props) =>
    props.buttonStyle === "numb" &&
    css`
      height: 45px;
      width: 45px;
      margin: 0 3px;
      line-height: 45px;
      border-radius: 50%;
    `}

  ${(props) =>
    props.buttonStyle === "btn" &&
    css`
      padding: 0 20px;
      border-radius: 50px;
    `}

  ${(props) =>
    props.isActive &&
    css`
      background-color: var(--color-grey-700);
      color: #fff;
    `}
`;

// Component
export default function Pagination({
  totalPages,
  onPageChange,
  curPage,
  totalElements,
}: PaginationProps) {
  // State and Hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);
  const currentPage = Number(searchParams.get("page")) || 1;

  // Event Handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      updatePage(next);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      updatePage(prev);
    }
  };

  const goToPage = (page: number | string) => {
    updatePage(Number(page));
  };

  // Helper Functions
  const updatePage = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
    onPageChange(page);
  };

  const generatePageNumbers = () => {
    const updatedPageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    // Add first page and ellipsis
    if (currentPage > 2) {
      updatedPageNumbers.push(1);
      if (currentPage > 3) {
        updatedPageNumbers.push("...");
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i <= totalPages) {
        updatedPageNumbers.push(i);
      }
    }

    // Add last page and ellipsis
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        updatedPageNumbers.push("...");
      }
      updatedPageNumbers.push(totalPages);
    }

    return updatedPageNumbers;
  };

  // Effects
  useEffect(() => {
    setPageNumbers(generatePageNumbers());
  }, [currentPage, totalPages]);

  // Early return
  if (totalPages <= 1) return null;

  // Render Methods
  const renderPageButton = (page: number | string, index: number) => {
    if (page === "...") {
      return (
        <PaginationButton
          key={index}
          buttonStyle="numb"
          disabled={true}
          isActive={false}
        >
          {page}
        </PaginationButton>
      );
    }

    return (
      <PaginationButton
        key={index}
        buttonStyle="numb"
        onClick={() => goToPage(page)}
        isActive={page === currentPage}
        disabled={page === currentPage}
      >
        {page}
      </PaginationButton>
    );
  };

  const renderNavigationButton = (
    direction: "prev" | "next",
    isDisabled: boolean
  ) => (
    <PaginationButton
      buttonStyle="btn"
      onClick={direction === "prev" ? prevPage : nextPage}
      disabled={isDisabled}
      aria-label={`${direction === "prev" ? "Previous" : "Next"} page`}
      isActive={false}
    >
      {direction === "prev" ? (
        <>
          <FaArrowCircleLeft />
          <span>Previous</span>
        </>
      ) : (
        <>
          <span>Next</span>
          <FaArrowCircleRight />
        </>
      )}
    </PaginationButton>
  );

  return (
    <StyledPagination>
      <Buttons>
        {renderNavigationButton("prev", currentPage === 1)}
        {pageNumbers.map((page, index) => renderPageButton(page, index))}
        {renderNavigationButton("next", currentPage === totalPages)}
      </Buttons>
    </StyledPagination>
  );
}