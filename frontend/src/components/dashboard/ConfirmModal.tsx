'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    error?: string | null;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = true,
    error = null,
    isLoading = false
}: ConfirmModalProps) {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setIsRendered(false);
                document.body.style.overflow = 'unset';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered && !isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.3s ease',
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div
                className="confirm-modal-content"
                style={{
                    backgroundColor: 'var(--background, #ffffff)',
                    color: 'var(--foreground, #111827)',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    padding: '32px 24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                    position: 'relative',
                    border: '1px solid var(--border, rgba(0,0,0,0.1))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDestructive ? '#ef4444' : '#0ea5e9',
                    marginBottom: '20px'
                }}>
                    <AlertTriangle size={36} />
                </div>

                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'inherit',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em'
                }}>
                    {title}
                </h3>

                <p style={{
                    fontSize: '1rem',
                    color: 'var(--muted-foreground, #6b7280)',
                    lineHeight: 1.6,
                    marginBottom: error ? '16px' : '32px'
                }}>
                    {message}
                </p>

                {error && (
                    <div style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <div style={{ minWidth: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            borderRadius: '14px',
                            height: '52px',
                            fontWeight: 600,
                            fontSize: '0.95rem'
                        }}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{
                            flex: 1.2,
                            borderRadius: '14px',
                            height: '52px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            backgroundColor: isDestructive ? '#ef4444' : 'var(--foreground, #111827)',
                            color: isDestructive ? 'white' : 'var(--background, #ffffff)',
                            boxShadow: isDestructive ? '0 10px 15px -3px rgba(239, 68, 68, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
