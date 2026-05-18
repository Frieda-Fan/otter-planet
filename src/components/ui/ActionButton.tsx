import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isGestureFocus?: boolean;
  variant?: 'default' | 'primary';
};

export function ActionButton({
  children,
  className = '',
  isGestureFocus = false,
  variant = 'default',
  ...buttonProps
}: ActionButtonProps) {
  const classes = [
    'chapter-button',
    variant === 'primary' ? 'chapter-button--primary' : '',
    isGestureFocus ? 'is-gesture-focus' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
