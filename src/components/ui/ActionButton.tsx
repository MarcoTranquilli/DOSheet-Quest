import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  block?: boolean;
}

export function ActionButton({
  children,
  className = '',
  variant = 'primary',
  block = false,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={`ui-button ui-button-${variant}${block ? ' is-block' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </button>
  );
}
