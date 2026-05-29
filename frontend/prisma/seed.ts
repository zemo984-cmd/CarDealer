import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Upsert Vehicle Types
    const sedan = await prisma.vehicletype.upsert({
        where: { id: 1 }, // Assuming ID 1, simplified for seed
        update: {},
        create: { typeName: 'Sedan', securityDeposit: 500, costPerMile: 0.5, availability: true },
    });

    const suv = await prisma.vehicletype.upsert({
        where: { id: 2 },
        update: {},
        create: { typeName: 'SUV', securityDeposit: 750, costPerMile: 0.8, availability: true },
    });

    const luxury = await prisma.vehicletype.upsert({
        where: { id: 3 },
        update: {},
        create: { typeName: 'Luxury', securityDeposit: 1500, costPerMile: 1.5, availability: true },
    });

    // Create Admin User
    const adminPassword = await bcrypt.hash('bmw series 5', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'zemo984@gmail.com' },
        update: {
            password: adminPassword,
            role: 'ADMIN',
        },
        create: {
            email: 'zemo984@gmail.com',
            password: adminPassword,
            name: 'Main Admin',
            role: 'ADMIN',
        },
    });

    const customerPassword = await bcrypt.hash('customer123', 10);
    // Create Sample Customers
    const customer1 = await prisma.user.upsert({
        where: { email: 'customer1@example.com' },
        update: {},
        create: {
            email: 'customer1@example.com',
            password: customerPassword,
            name: 'John Doe',
            role: 'CLIENT',
            address: '123 Main St, New York',
            occupation: 'Software Engineer',
        },
    });

    // Create Sample Chauffeurs
    const chauffeur1 = await prisma.chauffeur.upsert({
        where: { email: 'driver1@example.com' },
        update: {},
        create: {
            name: 'Ahmed Hassan',
            email: 'driver1@example.com',
            gender: 'Male',
            dateOfBirth: new Date('1990-01-01'),
            occupation: 'Professional Driver',
            address: '456 Nile St, Cairo',
            status: 'Active'
        }
    });

    // Create Sample Discounts
    const discount1 = await prisma.discount.upsert({
        where: { id: 1 },
        update: {},
        create: {
            amount: 50.00,
            customerType: 'VIP'
        }
    });

    // Create Cars with Realistic SALE Prices
    const carData = [
        { id: 1, make: 'BMW', model: '5 Series', year: 2024, price: 55000, regNumber: 'BMW-520-2024', images: '/images/cars/bmw-x5.png', typeId: sedan.id, condition: 'New', description: 'Brand new BMW 5 Series. Luxury meets performance.' },
        { id: 2, make: 'Mercedes', model: 'S-Class', year: 2024, price: 95000, regNumber: 'MB-S500-2024', images: '/images/cars/mercedes-s.png', typeId: luxury.id, condition: 'New', description: 'The pinnacle of luxury. Mercedes S-Class 2024.' },
        { id: 3, make: 'Toyota', model: 'Camry', year: 2023, price: 22000, regNumber: 'TY-CAM-2023', images: '/images/cars/toyota-camry.png', typeId: sedan.id, condition: 'Excellent', description: 'Reliable and fuel-efficient Toyota Camry.' },
        { id: 4, make: 'Audi', model: 'A6', year: 2024, price: 60000, regNumber: 'AU-A6-2024', images: '/images/cars/audi-a6.png', typeId: sedan.id, condition: 'New', description: 'Sophisticated Audi A6 with advanced tech.' },
        { id: 5, make: 'Skoda', model: 'Octavia', year: 2023, price: 28000, regNumber: 'SK-OCT-2023', images: '/images/cars/skoda-octavia.png', typeId: sedan.id, condition: 'Excellent', description: 'Practical and spacious Skoda Octavia.' },
        { id: 6, make: 'Mercedes', model: 'G-Wagon', year: 2024, price: 180000, regNumber: 'MB-G63-2024', images: '/images/cars/g-wagon.png', typeId: suv.id, condition: 'New', description: 'Unmatched off-road luxury: The G-Wagon.' },
    ];

    for (const car of carData) {
        await prisma.car.upsert({
            where: { id: car.id },
            update: {
                ...car,
                status: 'AVAILABLE',
                listingType: 'SALE'
            },
            create: {
                ...car,
                status: 'AVAILABLE',
                listingType: 'SALE'
            }
        });
    }

    // Create Sample Orders
    await prisma.order.upsert({
        where: { id: 1 },
        update: {},
        create: {
            userId: customer1.id,
            carId: 1,
            type: 'PURCHASE',
            totalAmount: 55000,
            status: 'COMPLETED'
        }
    });

    console.log('Seeding finished with Users, Chauffeurs, Discounts, and Orders.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
