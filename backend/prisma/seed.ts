import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const BRAND_IMAGES: Record<string, string[]> = {
  'BMW': [
    '/images/cars/bmw-x5.png',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',   // BMW M5 Competition
    'https://images.unsplash.com/photo-1698251015050-a79d0220f539?auto=format&fit=crop&w=800&q=80', // White BMW (Oct 2023)
    'https://images.unsplash.com/photo-1680298255666-6071fc905870?auto=format&fit=crop&w=800&q=80', // Silver BMW iX1 SUV
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80', // BMW i8
  ],
  'Toyota': [
    '/images/cars/toyota-camry.png',
    'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80', // Toyota Corolla
    'https://images.unsplash.com/photo-1578973330105-1512b36e46d2?auto=format&fit=crop&w=800&q=80', // Parked Toyota grey
    'https://images.unsplash.com/photo-1557775209-c50f9bc881ad?auto=format&fit=crop&w=800&q=80',   // Gray Toyota Supra
    'https://images.unsplash.com/photo-1618843479619-f9398f40a0c7?auto=format&fit=crop&w=800&q=80', // Toyota GR Supra
  ],
  'Audi': [
    '/images/cars/audi-a6.png',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80', // Black Audi R8
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=800&q=80', // Audi RS5
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',   // Audi R8 V10
    'https://images.unsplash.com/photo-1523983388277-336a66bf9be3?auto=format&fit=crop&w=800&q=80', // Audi e-tron
  ],
  'Mercedes-Benz': [
    '/images/cars/mercedes-s.png',
    '/images/cars/g-wagon.png',
    'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80', // Mercedes AMG C63S
    'https://images.unsplash.com/photo-1576074436157-6555fe967d80?auto=format&fit=crop&w=800&q=80', // Black Mercedes W205
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', // Mercedes AMG GT
  ],
  'Ford': [
    'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80', // Ford Mustang GT
    'https://images.unsplash.com/photo-1586665566945-673293a6ea98?auto=format&fit=crop&w=800&q=80', // Yellow/black Mustang Miami
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80', // Ford Explorer
    'https://images.unsplash.com/photo-1562141989-c5c79ac8f576?auto=format&fit=crop&w=800&q=80',   // Ford
  ],
  'Porsche': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', // White 911 GT3
    'https://images.unsplash.com/photo-1627070113880-8758d64867a0?auto=format&fit=crop&w=800&q=80', // Black 911 on grass
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', // Porsche Taycan
    'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80', // Porsche Cabriolet
    'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&w=800&q=80', // Porsche 718
  ],
  'Tesla': [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', // Tesla Model S
    'https://images.unsplash.com/photo-1572191267337-c1705e46645c?auto=format&fit=crop&w=800&q=80', // Black Tesla Model 3 (IAA)
    'https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=800&q=80', // Tesla
  ],
  'Chevrolet': [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',   // Corvette C8 (green)
    'https://images.unsplash.com/photo-1562444137-331d71acc800?auto=format&fit=crop&w=800&q=80',   // Black Corvette
    'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80', // Chevrolet Tahoe
  ],
  'Honda': [
    'https://images.unsplash.com/photo-1571095839087-5f237247ee28?auto=format&fit=crop&w=800&q=80', // White Honda Accord
    'https://images.unsplash.com/photo-1742445129873-ccd0af96c60f?auto=format&fit=crop&w=800&q=80', // Blue Honda Civic Type R
    'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?auto=format&fit=crop&w=800&q=80', // Honda
    'https://images.unsplash.com/photo-1533519183889-4e50257321c8?auto=format&fit=crop&w=800&q=80', // Honda Accord
  ],
  'Nissan': [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', // Nissan GT-R
  ],
  'Hyundai': [
    'https://images.unsplash.com/photo-1669046617066-b333a928ba95?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=800&q=80',
  ],
  'Kia': [
    'https://images.unsplash.com/photo-1647427017067-8f33cb4db90a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
  ],
  'Lexus': [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  ],
  'Land Rover': [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611245801314-e0e560b4594c?auto=format&fit=crop&w=800&q=80',
  ],
  'Aston Martin': [
    'https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=800&q=80', // Aston Martin DB11
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',   // Aston Martin Vantage
  ],
  'Lamborghini': [
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800&q=80', // Lamborghini Huracan
    'https://images.unsplash.com/photo-1631023099617-453c2e99b516?auto=format&fit=crop&w=800&q=80', // Yellow Aventador on road
    'https://images.unsplash.com/photo-1516515429572-bf32372f2409?auto=format&fit=crop&w=800&q=80', // Orange Aventador garage
    'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&w=800&q=80', // Lamborghini
  ],
  'Ferrari': [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', // Ferrari
    'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80', // Red Ferrari 458 on road
    'https://images.unsplash.com/photo-1579043496356-ab44769b774e?auto=format&fit=crop&w=800&q=80', // Ferrari
  ],
  'Volkswagen': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', // VW Golf GTI
  ],
  'Volvo': [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80', // Volvo XC90
  ],
  'Dodge': [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', // Dodge Charger/Challenger
  ],
  'Bugatti': [
    'https://images.unsplash.com/photo-1600706432502-75a0e286b92a?auto=format&fit=crop&w=800&q=80', // Bugatti Chiron
  ],
  'Skoda': [
    '/images/cars/skoda-octavia.png'
  ],
  'Jaguar': [
    'https://images.unsplash.com/photo-1592853625597-7d17be820d0c?auto=format&fit=crop&w=800&q=80'  // Jaguar F-Type
  ],
  'Maserati': [
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80'  // Maserati Ghibli
  ],
  'Rivian': [
    'https://images.unsplash.com/photo-1627454819213-f7724a737f7c?auto=format&fit=crop&w=800&q=80'  // Rivian R1T
  ],
  'Alfa Romeo': [
    'https://images.unsplash.com/photo-1585011664466-b7be4bded7df?auto=format&fit=crop&w=800&q=80'  // Alfa Romeo
  ],
  'Mazda': [
    'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?auto=format&fit=crop&w=800&q=80',   // Mazda MX-5 Miata
    'https://images.unsplash.com/photo-1593055482315-a1d13f02434a?auto=format&fit=crop&w=800&q=80'  // Mazda
  ],
  'Subaru': [
    'https://images.unsplash.com/photo-1626294336769-ab28a2a0614e?auto=format&fit=crop&w=800&q=80'  // Subaru WRX STI
  ],
  'McLaren': [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80'    // McLaren 720S
  ]
};

const BRANDS = [
  { make: 'BMW', models: ['330i', 'M4', '530i', 'iX', 'X7', 'X3', 'M5'], type: 'luxury' },
  { make: 'Toyota', models: ['Corolla', 'Highlander', 'Prius', 'Land Cruiser', 'Tacoma', 'Tundra', 'RAV4 Hybrid'], type: 'sedan_suv' },
  { make: 'Audi', models: ['A4', 'Q5', 'e-tron GT', 'R8 V10', 'Q8', 'RS6 Avant'], type: 'luxury' },
  { make: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'GLC Coupe', 'GLE', 'CLA', 'EQS'], type: 'luxury' },
  { make: 'Ford', models: ['Explorer', 'Bronco Wildtrak', 'Focus ST', 'F-150 Lightning', 'Escape'], type: 'utility' },
  { make: 'Porsche', models: ['Panamera', 'Macan GTS', '718 Cayman', '911 GT3'], type: 'sport' },
  { make: 'Tesla', models: ['Model 3 Performance', 'Model Y Long Range', 'Model X Plaid'], type: 'electric' },
  { make: 'Chevrolet', models: ['Camaro ZL1', 'Silverado Trail Boss', 'Tahoe Premier', 'Bolt EV'], type: 'utility' },
  { make: 'Honda', models: ['Accord Hybrid', 'CR-V Sport', 'Pilot Elite', 'Civic Sedan'], type: 'sedan_suv' },
  { make: 'Nissan', models: ['Altima', 'Patrol Nismo', '370Z Nismo', 'Ariya', 'Pathfinder'], type: 'sport' },
  { make: 'Hyundai', models: ['Tucson Hybrid', 'Santa Fe', 'Palisade', 'Kona EV'], type: 'sedan_suv' },
  { make: 'Kia', models: ['Sorento', 'Stinger GT', 'Telluride', 'Sportage Plug-in'], type: 'sedan_suv' },
  { make: 'Lexus', models: ['ES 300h', 'LX 600 VIP', 'IS 500', 'GX 550'], type: 'luxury' },
  { make: 'Land Rover', models: ['Range Rover Velar', 'Defender 90', 'Discovery Sport'], type: 'utility' },
  { make: 'Aston Martin', models: ['Vantage F1 Edition', 'DBX 707', 'DBS Superleggera'], type: 'luxury' },
  { make: 'Lamborghini', models: ['Urus Performante', 'Revuelto', 'Huracan Sterrato'], type: 'sport' },
  { make: 'Ferrari', models: ['Roma Spider', '296 GTB', 'Purosangue'], type: 'sport' },
  { make: 'Volkswagen', models: ['Tiguan R-Line', 'Passat Elegance', 'ID.4 EV', 'Arteon'], type: 'sedan_suv' },
  { make: 'Volvo', models: ['XC60 Recharge', 'S90 Inscription', 'C40 Recharge'], type: 'luxury' },
  { make: 'Dodge', models: ['Challenger SRT', 'Durango SRT Hellcat', 'Hornet GT'], type: 'sport' },
];

async function main() {
  console.log('Start seeding...');

  // Clean database
  console.log('Cleaning database...');
  await prisma.invoice.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.bill.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.tradeinrequest.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.activitylog.deleteMany({});
  await prisma.chauffeurbata.deleteMany({});
  await prisma.chauffeur.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.vehicletype.deleteMany({});
  await prisma.systemsetting.deleteMany({});
  console.log('Database cleaned.');

  // 1. Create a Branch
  const mainBranch = await prisma.branch.create({
    data: {
      name: 'Main Branch',
      address: '123 Car Street, Auto City',
      phone: '+1234567890',
    },
  });
  console.log('Created branch:', mainBranch.name);

  // 2. Create System Settings
  await prisma.systemsetting.createMany({
    data: [
      { key: 'site_name', value: 'Car Dealer Pro', description: 'Name of the website' },
      { key: 'contact_email', value: 'support@cardealer.local', description: 'Contact Email' },
    ],
    skipDuplicates: true,
  });
  console.log('Created system settings');

  // 3. Create Vehicle Types
  const suvType = await prisma.vehicletype.create({ data: { typeName: 'SUV', securityDeposit: 500, costPerMile: 2.5 } });
  const sedanType = await prisma.vehicletype.create({ data: { typeName: 'Sedan', securityDeposit: 300, costPerMile: 1.5 } });
  const luxuryType = await prisma.vehicletype.create({ data: { typeName: 'Luxury', securityDeposit: 1000, costPerMile: 4.0 } });
  const sportType = await prisma.vehicletype.create({ data: { typeName: 'Sports', securityDeposit: 1200, costPerMile: 5.0 } });
  const truckType = await prisma.vehicletype.create({ data: { typeName: 'Truck', securityDeposit: 600, costPerMile: 3.0 } });
  console.log('Created vehicle types');

  // 4. Generate Cars
  const carsToInsert: any[] = [];

  // Insert Local Images first to guarantee they are correct
  const localCars = [
    { make: 'BMW', model: 'X5', year: 2023, price: 65000, regNumber: 'BMW-X5-2023', condition: 'New', status: 'AVAILABLE', typeId: suvType.id, listingType: 'SALE', images: '/images/cars/bmw-x5.png', description: 'Premium midsize luxury SUV with excellent performance.' },
    { make: 'Toyota', model: 'Camry', year: 2022, price: 25000, regNumber: 'TOY-CAM-2022', condition: 'Used', status: 'AVAILABLE', typeId: sedanType.id, listingType: 'SALE', images: '/images/cars/toyota-camry.png', description: 'Highly reliable midsize sedan offering comfortable ride.' },
    { make: 'Audi', model: 'A6', year: 2023, price: 55000, regNumber: 'AUDI-A6-2023', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: '/images/cars/audi-a6.png', description: 'Quiet, spacious cabin crafted from premium materials.' },
    { make: 'Mercedes-Benz', model: 'S-Class', year: 2023, price: 110000, regNumber: 'MB-S-2023', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: '/images/cars/mercedes-s.png', description: 'The pinnacle of automotive luxury and comfort.' },
    { make: 'Mercedes-Benz', model: 'G-Wagon', year: 2023, price: 180000, regNumber: 'MB-G-2023', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: '/images/cars/g-wagon.png', description: 'Iconic luxury off-roader with powerful performance.' },
    { make: 'Skoda', model: 'Octavia', year: 2021, price: 18000, regNumber: 'SKO-OCT-2021', condition: 'Used', status: 'AVAILABLE', typeId: sedanType.id, listingType: 'SALE', images: '/images/cars/skoda-octavia.png', description: 'Practical, spacious and family-friendly sedan.' },
  ];

  carsToInsert.push(...localCars);

  // Add Explicit Unsplash Cars
  const explicitUnsplashCars = [
    { make: 'Tesla', model: 'Model S', year: 2023, price: 89990, regNumber: 'TSLA-S-2023', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', description: 'All-electric luxury sedan offering incredible acceleration.' },
    { make: 'Ford', model: 'Mustang GT', year: 2022, price: 45000, regNumber: 'FORD-MUS-22', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80', description: 'Modern muscle car performance with a roaring V8 engine.' },
    { make: 'Porsche', model: '911 Carrera', year: 2023, price: 120000, regNumber: 'PORS-911-23', condition: 'New', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', description: 'Benchmark sports car with precision handling.' },
    { make: 'Nissan', model: 'GT-R', year: 2021, price: 115000, regNumber: 'NISS-GTR-21', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', description: 'High-performance AWD sports car featuring twin-turbo V6.' },
    { make: 'Chevrolet', model: 'Corvette Stingray', year: 2022, price: 78000, regNumber: 'CHEV-COR-22', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', description: 'Supercar-level mid-engine performance and striking looks.' },
    { make: 'Honda', model: 'Civic Type R', year: 2023, price: 43000, regNumber: 'HOND-CIV-23', condition: 'New', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?auto=format&fit=crop&w=800&q=80', description: 'Track-ready high performance hot hatch with aggressive styling.' },
    { make: 'Lamborghini', model: 'Huracan Evo', year: 2022, price: 260000, regNumber: 'LAMB-HUR-22', condition: 'Used', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800&q=80', description: 'Italian supercar powered by a screaming V10.' },
    { make: 'Ferrari', model: 'F8 Tributo', year: 2023, price: 280000, regNumber: 'FERR-F8-23', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', description: 'Mid-engine supercar representing the peak of Ferrari V8 performance.' },
    { make: 'McLaren', model: '720S', year: 2022, price: 299000, regNumber: 'MCL-720S-22', condition: 'Used', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80', description: 'Stunning carbon-fiber supercar offering explosive speed.' },
    { make: 'Dodge', model: 'Charger Hellcat', year: 2021, price: 75000, regNumber: 'DODG-CHA-21', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', description: 'Supercharged V8 muscle sedan offering immense straight-line speed.' },
    { make: 'Aston Martin', model: 'DB11', year: 2022, price: 205000, regNumber: 'ASTN-DB11-22', condition: 'Used', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=800&q=80', description: 'Grand tourer with breathtaking design and hand-crafted interior.' },
    { make: 'Rolls-Royce', model: 'Phantom', year: 2023, price: 460000, regNumber: 'RR-PHA-23', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1632245889027-e406faaa19cc?auto=format&fit=crop&w=800&q=80', description: 'Ultimate expression of luxury offering unmatched comfort.' },
    { make: 'Bentley', model: 'Continental GT', year: 2023, price: 240000, regNumber: 'BENT-CON-23', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80', description: 'Grand touring luxury with robust power.' },
    { make: 'Subaru', model: 'WRX STI', year: 2021, price: 38000, regNumber: 'SUB-WRX-21', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1626294336769-ab28a2a0614e?auto=format&fit=crop&w=800&q=80', description: 'Rally-bred performance sedan featuring symmetric AWD.' },
    { make: 'Mazda', model: 'MX-5 Miata', year: 2022, price: 28000, regNumber: 'MAZ-MIA-22', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?auto=format&fit=crop&w=800&q=80', description: 'Lightweight roadster known for outstanding balance.' },
    { make: 'Volkswagen', model: 'Golf GTI', year: 2023, price: 32000, regNumber: 'VW-GTI-23', condition: 'New', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', description: 'Engaging driving dynamics combined with practicality.' },
    { make: 'Toyota', model: 'GR Supra', year: 2022, price: 53000, regNumber: 'TOY-SUP-22', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1618843479619-f9398f40a0c7?auto=format&fit=crop&w=800&q=80', description: 'Modern sports coupe with striking body lines.' },
    { make: 'Porsche', model: 'Taycan GTS', year: 2023, price: 135000, regNumber: 'PORS-TAY-23', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', description: 'Pure Porsche sports performance with electric architecture.' },
    { make: 'Jaguar', model: 'F-Type R', year: 2022, price: 82000, regNumber: 'JAG-FTY-22', condition: 'Used', status: 'AVAILABLE', typeId: sportType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1592853625597-7d17be820d0c?auto=format&fit=crop&w=800&q=80', description: 'Beautiful British sports car with supercharged V8.' },
    { make: 'Maserati', model: 'Ghibli S', year: 2022, price: 85000, regNumber: 'MAS-GHI-22', condition: 'Used', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80', description: 'Italian luxury sedan with Ferrari-built engine.' },
    { make: 'Bugatti', model: 'Chiron Sport', year: 2023, price: 3300000, regNumber: 'BUG-CHI-23', condition: 'New', status: 'AVAILABLE', typeId: luxuryType.id, listingType: 'SALE', images: 'https://images.unsplash.com/photo-1600706432502-75a0e286b92a?auto=format&fit=crop&w=800&q=80', description: 'Bespoke hypercar with quad-turbo W16 performance.' },
  ];

  carsToInsert.push(...explicitUnsplashCars);

  // Now dynamically generate another 100+ cars to reach 120+ total cars
  console.log('Generating dynamic cars...');
  let index = 1;
  const brandImgCounters: Record<string, number> = {};

  for (const brand of BRANDS) {
    brandImgCounters[brand.make] = 0;

    for (const model of brand.models) {
      const newPrice = Math.floor(Math.random() * (120000 - 30000) + 30000);
      const usedPrice = Math.floor(newPrice * 0.65);

      let typeId = sedanType.id;
      const lowerModel = model.toLowerCase();
      const lowerBrandType = brand.type;

      if (lowerBrandType === 'sport') {
        typeId = sportType.id;
      } else if (lowerBrandType === 'luxury') {
        typeId = luxuryType.id;
      } else if (lowerBrandType === 'electric') {
        typeId = luxuryType.id;
      }

      if (lowerModel.includes('x5') || lowerModel.includes('q5') || lowerModel.includes('xc') || lowerModel.includes('defender') || lowerModel.includes('ranger') || lowerModel.includes('tucson') || lowerModel.includes('sportage') || lowerModel.includes('rav4') || lowerModel.includes('bronco') || lowerModel.includes('explorer') || lowerModel.includes('tahoe') || lowerModel.includes('pilot') || lowerModel.includes('cr-v') || lowerModel.includes('urus') || lowerModel.includes('durango') || lowerModel.includes('lx') || lowerModel.includes('gx') || lowerModel.includes('discovery') || lowerModel.includes('gle') || lowerModel.includes('glc') || lowerModel.includes('q8') || lowerModel.includes('cayenne') || lowerModel.includes('macan') || lowerModel.includes('dbx') || lowerModel.includes('purosangue')) {
        typeId = suvType.id;
      } else if (lowerModel.includes('f-150') || lowerModel.includes('silverado') || lowerModel.includes('tacoma') || lowerModel.includes('tundra') || lowerModel.includes('raptor') || lowerModel.includes('r1t') || lowerModel.includes('boss')) {
        typeId = truckType.id;
      }

      // Assign Unsplash image in round robin FOR THE SPECIFIC BRAND
      const makeImages = BRAND_IMAGES[brand.make] || [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' // fallback
      ];

      const imgCounter = brandImgCounters[brand.make];
      const image1 = makeImages[imgCounter % makeImages.length];
      const image2 = makeImages[(imgCounter + 1) % makeImages.length];
      brandImgCounters[brand.make] = imgCounter + 2;

      // New Car
      carsToInsert.push({
        make: brand.make,
        model: model,
        year: 2023 + Math.floor(Math.random() * 2), // 2023 or 2024
        price: newPrice,
        regNumber: `REG-${brand.make.substring(0,3).toUpperCase()}-${model.substring(0,3).toUpperCase()}-NEW-${index}`,
        condition: 'New',
        status: 'AVAILABLE',
        typeId: typeId,
        listingType: 'SALE',
        images: image1,
        description: `This brand new ${brand.make} ${model} features advanced engineering, state-of-the-art safety specs, and premium styling for the modern driver.`,
      });

      // Used Car
      carsToInsert.push({
        make: brand.make,
        model: model,
        year: 2018 + Math.floor(Math.random() * 5), // 2018 to 2022
        price: usedPrice,
        regNumber: `REG-${brand.make.substring(0,3).toUpperCase()}-${model.substring(0,3).toUpperCase()}-USD-${index}`,
        condition: 'Used',
        status: 'AVAILABLE',
        typeId: typeId,
        listingType: 'SALE',
        images: image2,
        description: `Pre-owned ${brand.make} ${model} in excellent mechanical condition. Fully inspected, clean history, and outstanding value for money.`,
      });

      index++;
    }
  }

  // Slice at exactly 120 cars
  const finalCars = carsToInsert.slice(0, 120);

  // Filter out duplicate regNumbers
  const seenReg = new Set();
  const uniqueCars = finalCars.filter(c => {
    if (seenReg.has(c.regNumber)) return false;
    seenReg.add(c.regNumber);
    return true;
  });

  await prisma.car.createMany({
    data: uniqueCars,
    skipDuplicates: true,
  });
  console.log(`Successfully created ${uniqueCars.length} cars.`);

  // 5. Create Users (Admin, Employee, Client)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@cardealer.local',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'Active',
      branchId: mainBranch.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Employee User',
      email: 'employee@cardealer.local',
      password: hashedPassword,
      role: 'EMPLOYEE',
      status: 'Active',
      branchId: mainBranch.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Client User',
      email: 'client@cardealer.local',
      password: hashedPassword,
      role: 'CLIENT',
      status: 'Active',
    },
  });
  console.log('Created users');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
