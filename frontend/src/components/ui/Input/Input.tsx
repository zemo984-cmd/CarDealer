import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, ...props }, ref) => {
        return (
            <div className={styles.inputWrapper}>
                {label && <label className={styles.label}>{label}</label>}
                <input
                    type={type}
                    className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
                    ref={ref}
                    {...props}
                />
                {error && <span className={styles.errorText}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
