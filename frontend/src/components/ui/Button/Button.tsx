import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', fullWidth, ...props }, ref) => {
    const variantClass = styles[variant];
    const sizeClass = size === 'default' ? '' : styles[size];
    const widthClass = fullWidth ? styles.fullWidth : '';
    
    const combinedClassName = `${styles.button} ${variantClass} ${sizeClass} ${widthClass} ${className || ''}`;

    return (
      <button
        ref={ref}
        className={combinedClassName.trim()}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
