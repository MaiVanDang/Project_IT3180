import React from 'react'
import "./Button.css"

interface ButtonProps {
    text: string;

    onClick?: () => void;

    type ?: 'button' | 'submit';
    className?: string;
    id?: string;
}

export const Button: React.FC<ButtonProps> = ({ text, onClick, type = 'button', className, id }) => {

  return (
    <button type={type} onClick={onClick} className={className} id={id}>
        {text}
    </button>
  )
}

export default Button;
