'use client';

import { deleteCar } from "@/app/actions/cars";
import { Button } from "@/components/ui/Button/Button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal";

export function DeleteCarButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = () => {
        setError(null);
        startTransition(async () => {
            const result = await deleteCar(id);
            if (result.success) {
                setIsModalOpen(false);
                router.refresh(); // Force UI refresh
            } else {
                setError(result.error || "Failed to delete car");
            }
        });
    };

    return (
        <>
            <Button size="sm" variant="destructive" onClick={() => {
                setError(null);
                setIsModalOpen(true);
            }} disabled={isPending}>
                <Trash2 size={16} />
            </Button>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => !isPending && setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Move to Trash"
                message="Are you sure you want to move this car to the trash? You can restore it later."
                confirmText="Move to Trash"
                cancelText="Cancel"
                error={error}
                isLoading={isPending}
            />
        </>
    );
}
