'use client';

import { restoreCar, permanentDeleteCar } from "@/app/actions/cars";
import { Button } from "@/components/ui/Button/Button";
import { RefreshCw, Trash2 } from 'lucide-react';
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal";

export function TrashActions({ carId }: { carId: number }) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRestore = () => {
        startTransition(async () => {
            const result = await restoreCar(carId);
            if (result.success) {
                router.refresh(); // Force UI refresh
            } else {
                alert(result.error || "Failed to restore car");
            }
        });
    };

    const handlePermanentDelete = () => {
        setError(null);
        startTransition(async () => {
            const result = await permanentDeleteCar(carId);
            if (result.success) {
                setIsModalOpen(false);
                router.refresh(); // Force UI refresh
            } else {
                setError(result.error || "Failed to permanently delete car");
            }
        });
    };

    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button
                size="sm"
                onClick={handleRestore}
                disabled={isPending}
                style={{ backgroundColor: '#10b981', color: 'white' }}
            >
                <RefreshCw size={16} style={{ marginRight: '8px' }} className={isPending && !isModalOpen ? 'animate-spin' : ''} />
                Restore
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                    setError(null);
                    setIsModalOpen(true);
                }}
                disabled={isPending}
                style={{ color: '#ef4444' }}
            >
                <Trash2 size={16} style={{ marginRight: '8px' }} />
                Delete Permanently
            </Button>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => !isPending && setIsModalOpen(false)}
                onConfirm={handlePermanentDelete}
                title="Permanent Delete"
                message="Are you sure you want to permanently delete this car? This action cannot be undone."
                confirmText="Delete Forever"
                cancelText="Cancel"
                isDestructive={true}
                error={error}
                isLoading={isPending}
            />
        </div>
    );
}
