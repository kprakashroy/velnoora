import type { ButtonHTMLAttributes } from 'react';
import React from 'react';

export interface ButtonCircleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string;
}

const ButtonCircle2: React.FC<ButtonCircleProps> = ({
  className = '',
  size = ' ',
  ...args
}) => {
  return (
    <button
      type="button"
      className={`ttnc-ButtonCircle flex items-center justify-center rounded-full !leading-none disabled:bg-opacity-70 ${className} ${size} `}
      {...args}
    />
  );
};

export default ButtonCircle2;
