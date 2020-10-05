import React from 'react';
import './Buttons.css';

type ButtonProps = {
  id: string;
  label: JSX.Element;
  onClick(event: React.MouseEvent<HTMLElement>): void;
};

export function Button({ id, label, onClick }: ButtonProps): JSX.Element {
  return (
    <div id={id} className={'button'} onClick={onClick}>
      {label}
    </div>
  );
}
