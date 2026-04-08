import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type PanelCardProps<T extends ElementType> = {
  children: ReactNode;
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function PanelCard<T extends ElementType = 'section'>({
  children,
  as,
  className = '',
  ...props
}: PanelCardProps<T>) {
  const Component = (as || 'section') as ElementType;
  return (
    <Component {...props} className={`panel${className ? ` ${className}` : ''}`}>
      {children}
    </Component>
  );
}
