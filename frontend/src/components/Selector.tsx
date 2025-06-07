import { createContext, useContext, useState } from "react";
import styled from "styled-components";
import { capitalize } from "../utils/helpers";

// Types
interface SelectorProps {
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  value: string;
  label: string;
}

// Styled Components
const StyledSelector = styled.div`
  border: none;
  background-color: var(--color-grey-0);
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  align-items: center;
  transition: none;
  padding: 6px 6px 6px 0px;
  width: 100%;
`;

const StyledOption = styled.div`
  border: none;
  display: flex;
  gap: 5px;
`;

const StyledInput = styled.input`
  width: 20px;
  height: 20px;
  appearance: none;
  border: 1px solid var(--color-grey-400);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  background-color: var(--color-grey-100);

  &:checked {
    background-color: var(--color-green-500);
    border-color: var(--color-grey-400);
  }

  &:hover {
    border-color: var(--color-grey-400);
  }
`;

const StyledLabel = styled.label`
  font-size: 14px;
  color: var(--color-grey-700);
`;

// Component
const Selector: React.FC<SelectorProps> = ({ 
  options, 
  onChange, 
  id, 
  value, 
  label 
}) => {
  return (
    <StyledSelector id={id}>
      <StyledLabel>{label}</StyledLabel>
      {options.map((option) => (
        <StyledOption key={option}>
          <StyledInput
            type="radio"
            id={`${id}-${option}`}
            name={id}
            value={option}
            checked={value === option}
            onChange={onChange}
          />
          <StyledLabel htmlFor={`${id}-${option}`}>
            {capitalize(option)}
          </StyledLabel>
        </StyledOption>
      ))}
    </StyledSelector>
  );
};

export default Selector;