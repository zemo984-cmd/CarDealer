'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getCars(params: {
    keyword?: string;
    make?: string;
    minPrice?: string;
    maxPrice?: string;
    limit?: number;
    status?: string;
} = {}) {
    try {
        const where: any = { isDeleted: false };

        if (params.keyword) {
            where.OR = [
                { make: { contains: params.keyword } },
                { model: { contains: params.keyword } },
                { description: { contains: params.keyword } }
            ];
        }

        if (params.make) where.make = { contains: params.make };
        if (params.minPrice) where.price = { ...where.price, gte: parseFloat(params.minPrice) };
        if (params.maxPrice) where.price = { ...where.price, lte: parseFloat(params.maxPrice) };
        if (params.status) where.status = params.status;

        const allCars = await prisma.car.findMany({
            // where, // Temporarily disabled to avoid Prisma runtime error
            take: params.limit,
            include: { vehicletype: true } as any
        });

        // Temporary workaround: Filter in JS
        const cars = (allCars as any[]).filter(car => {
            if (params.make && !car.make.toLowerCase().includes(params.make.toLowerCase())) return false;
            if (params.minPrice && Number(car.price) < parseFloat(params.minPrice)) return false;
            if (params.maxPrice && Number(car.price) > parseFloat(params.maxPrice)) return false;
            if (params.status && car.status !== params.status) return false;

            if (params.keyword) {
                const kw = params.keyword.toLowerCase();
                const match = car.make.toLowerCase().includes(kw) ||
                    car.model.toLowerCase().includes(kw) ||
                    (car.description && car.description.toLowerCase().includes(kw));
                if (!match) return false;
            }

            return true;
        });

        // Convert Decimal to number for serialization
        const serializedCars = cars.map((car: any) => ({
            ...car,
            price: Number(car.price),
            vehicletype: car.vehicletype ? {
                ...car.vehicletype,
                securityDeposit: Number(car.vehicletype.securityDeposit),
                costPerMile: Number(car.vehicletype.costPerMile),
            } : null
        }));

        return { success: true, data: serializedCars };
    } catch (error) {
        console.error('Error fetching cars:', error);
        return { success: false, error: 'Failed to fetch cars' };
    }
}

export async function getCarById(id: number) {
    try {
        const car = await prisma.car.findUnique({
            where: { id },
            include: { vehicletype: true }
        });

        if (!car) return { success: false, error: 'Car not found' };

        const carData = car as any;
        const serializedCar = {
            ...carData,
            price: Number(carData.price),
            vehicletype: carData.vehicletype ? {
                ...carData.vehicletype,
                securityDeposit: Number(carData.vehicletype.securityDeposit),
                costPerMile: Number(carData.vehicletype.costPerMile),
            } : null
        };

        return { success: true, data: serializedCar };
    } catch (error) {
        console.error('Error fetching car:', error);
        return { success: false, error: 'Failed to fetch car' };
    }
}

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCar(formData: FormData) {
    const rawFormData = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        regNumber: formData.get('regNumber') as string || `REG-${Date.now()}`,
        mileage: Number(formData.get('mileage')) || 0,
        meterReading: Number(formData.get('meterReading')) || 0,
        condition: formData.get('condition') as string,
        images: formData.get('images') as string,
        status: (formData.get('status') as string) || 'AVAILABLE',
        description: formData.get('description') as string,
        typeId: formData.get('typeId') ? Number(formData.get('typeId')) : null,
    };

    try {
        await (prisma.car as any).create({
            data: {
                ...rawFormData,
                status: rawFormData.status,
                listingType: formData.get('listingType') as string || 'SALE',
            }
        });
    } catch (error) {
        console.error('Failed to create car:', error);
        return { success: false, error: 'Failed to create car' };
    }

    revalidatePath('/dashboard/cars');
    revalidatePath('/');
    return { success: true };
}

export async function updateCar(id: number, formData: FormData) {
    const rawFormData = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        mileage: Number(formData.get('mileage')) || 0,
        meterReading: Number(formData.get('meterReading')) || 0,
        condition: formData.get('condition') as string,
        images: formData.get('images') as string,
        status: (formData.get('status') as string) || 'AVAILABLE',
        description: formData.get('description') as string,
        typeId: formData.get('typeId') ? Number(formData.get('typeId')) : null,
    };

    // Only include regNumber if it's actually in the form
    const regNumber = formData.get('regNumber') as string;
    const updateData: any = {
        ...rawFormData,
        status: rawFormData.status as any,
        listingType: formData.get('listingType') as string || 'SALE',
    };
    if (regNumber) updateData.regNumber = regNumber;

    try {
        await (prisma.car as any).update({
            where: { id },
            data: updateData,
        });
    } catch (error) {
        console.error('Failed to update car:', error);
        return { success: false, error: 'Failed to update car' };
    }

    revalidatePath('/dashboard/cars');
    revalidatePath(`/cars/${id}`);
    revalidatePath('/');
    return { success: true };
}

export async function getTrashedCars() {
    try {
        const allCars = await prisma.car.findMany({
            include: { vehicletype: true } as any,
            orderBy: { createdAt: 'desc' } as any
        });

        // Temporary workaround: Filter in JS
        const cars = (allCars as any[]).filter(car => car.isDeleted === true || car.isDeleted === 1);

        const serializedCars = cars.map((car: any) => ({
            ...car,
            price: Number(car.price),
            vehicletype: car.vehicletype ? {
                ...car.vehicletype,
                securityDeposit: Number(car.vehicletype.securityDeposit),
                costPerMile: Number(car.vehicletype.costPerMile),
            } : null
        }));

        return { success: true, data: serializedCars };
    } catch (error) {
        console.error('Error fetching trashed cars:', error);
        return { success: false, error: 'Failed to fetch trashed cars' };
    }
}

export async function deleteCar(id: number) {
    try {
        try {
            await (prisma.car as any).update({
                where: { id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date()
                }
            });
        } catch (prismaError) {
            console.warn('Prisma update failed, falling back to Raw SQL:', prismaError);
            await prisma.$executeRaw`UPDATE car SET isDeleted = 1, deletedAt = NOW() WHERE id = ${id}`;
        }
        revalidatePath('/dashboard/cars');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete car:', error);
        return { success: false, error: 'Failed to delete car. Please try again.' };
    }
}

export async function restoreCar(id: number) {
    try {
        try {
            await (prisma.car as any).update({
                where: { id },
                data: {
                    isDeleted: false,
                    deletedAt: null
                }
            });
        } catch (prismaError) {
            console.warn('Prisma restore failed, falling back to Raw SQL:', prismaError);
            await prisma.$executeRaw`UPDATE car SET isDeleted = 0, deletedAt = NULL WHERE id = ${id}`;
        }
        revalidatePath('/dashboard/cars');
        revalidatePath('/dashboard/cars/trash');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to restore car:', error);
        return { success: false, error: 'Failed to restore car' };
    }
}

export async function permanentDeleteCar(id: number) {
    try {
        try {
            await prisma.car.delete({
                where: { id },
            });
        } catch (prismaError) {
            console.warn('Prisma delete failed, falling back to Raw SQL:', prismaError);
            await prisma.$executeRaw`DELETE FROM car WHERE id = ${id}`;
        }
        revalidatePath('/dashboard/cars/trash');
        return { success: true };
    } catch (error) {
        console.error('Failed to permanently delete car:', error);
        return { success: false, error: 'Failed to permanently delete car' };
    }
}
