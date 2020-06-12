import React, { ReactNode } from 'react';

interface FormGroupProps {
  label: ReactNode;
  input: ReactNode;
}

export const FormGroup = ({ label, input }: FormGroupProps) => {
  return (
    <div>
      <p>{label}</p>
      <p>{input}</p>
    </div>
  );
};
