/* ======================================
   CAR DEALER SYSTEM - DATABASE EXPORT
   COMPATIBLE SCHEMA + SEED DATA
   Matches 'prisma/schema.prisma' perfectly
   Updated: Phase 1 - New Models Added
   ====================================== */

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Setup Database
CREATE DATABASE IF NOT EXISTS `cardealer`;
USE `cardealer`;

-- 2. Drop Existing Tables (in reverse dependency order)
DROP TABLE IF EXISTS `activitylog`;
DROP TABLE IF EXISTS `notification`;
DROP TABLE IF EXISTS `message`;
DROP TABLE IF EXISTS `systemsetting`;
DROP TABLE IF EXISTS `tradeinrequest`;
DROP TABLE IF EXISTS `invoice`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `bill`;
DROP TABLE IF EXISTS `booking`;
DROP TABLE IF EXISTS `chauffeurbata`;
DROP TABLE IF EXISTS `chauffeur`;
DROP TABLE IF EXISTS `car`;
DROP TABLE IF EXISTS `vehicletype`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `discount`;
DROP TABLE IF EXISTS `branch`;
DROP TABLE IF EXISTS `_prisma_migrations`;

-- =========================
-- 3. CREATE TABLES
-- =========================

-- branch
CREATE TABLE `branch` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(191)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- user (UPDATED: added profileImage, notificationsEnabled, colorBlindMode, dashboardColor, resetAttempts)
CREATE TABLE `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `gender` VARCHAR(191),
    `dateOfBirth` DATETIME(0),
    `occupation` VARCHAR(255),
    `address` VARCHAR(255),
    `role` ENUM('CLIENT', 'ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'CLIENT',
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `branchId` INT,
    `resetToken` VARCHAR(255),
    `resetTokenExpiry` DATETIME(0),
    `resetAttempts` INT NOT NULL DEFAULT 0,
    `profileImage` TEXT,
    `notificationsEnabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `colorBlindMode` BOOLEAN NOT NULL DEFAULT FALSE,
    `dashboardColor` VARCHAR(191) DEFAULT '#ffffff',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
    CONSTRAINT `User_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- vehicletype
CREATE TABLE `vehicletype` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `typeName` VARCHAR(255) NOT NULL,
    `securityDeposit` DECIMAL(65, 30) NOT NULL,
    `costPerMile` DECIMAL(65, 30) NOT NULL,
    `availability` BOOLEAN NOT NULL DEFAULT TRUE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- car
CREATE TABLE `car` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `make` VARCHAR(255) NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `year` INT NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `regNumber` VARCHAR(191) NOT NULL UNIQUE,
    `mileage` INT DEFAULT 0,
    `meterReading` INT DEFAULT 0,
    `condition` VARCHAR(191) NOT NULL,
    `status` ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE', 'SOLD', 'RESERVED') NOT NULL DEFAULT 'AVAILABLE',
    `description` TEXT,
    `images` TEXT,
    `typeId` INT,
    `listingType` VARCHAR(191) NOT NULL DEFAULT 'SALE',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
    CONSTRAINT `Car_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `vehicletype`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- chauffeur
CREATE TABLE `chauffeur` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(0) NOT NULL,
    `occupation` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `address` VARCHAR(255) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active'
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- chauffeurbata
CREATE TABLE `chauffeurbata` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `days` INT NOT NULL,
    `dailyAmount` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `chauffeurId` INT NOT NULL,
    CONSTRAINT `ChauffeurBata_chauffeurId_fkey` FOREIGN KEY (`chauffeurId`) REFERENCES `chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- discount
CREATE TABLE `discount` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `amount` DECIMAL(65, 30) NOT NULL,
    `customerType` VARCHAR(191) NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- booking
CREATE TABLE `booking` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `bookingDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `driveOption` VARCHAR(191) NOT NULL DEFAULT 'Self-Drive',
    `meterReading` INT NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `amount` DECIMAL(65, 30) NOT NULL,
    `securityDeposit` DECIMAL(65, 30) NOT NULL,
    `securityPaymentStatus` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `customerId` INT NOT NULL,
    `carId` INT NOT NULL,
    `discountId` INT,
    `chauffeurId` INT,
    CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Booking_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Booking_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `Booking_chauffeurId_fkey` FOREIGN KEY (`chauffeurId`) REFERENCES `chauffeur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- bill
CREATE TABLE `bill` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `bookingId` INT NOT NULL UNIQUE,
    `billDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `totalAmount` DECIMAL(65, 30) NOT NULL,
    `discountAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `taxAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `advanceAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `balanceAmount` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Unpaid',
    CONSTRAINT `Bill_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- order
CREATE TABLE `order` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `carId` INT NOT NULL,
    `type` ENUM('PURCHASE', 'BOOKING', 'INSTALLMENT', 'TRADE_IN') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `totalAmount` DECIMAL(65, 30) NOT NULL,
    `installmentPlan` VARCHAR(191),
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
    CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Order_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- invoice
CREATE TABLE `invoice` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `orderId` INT NOT NULL UNIQUE,
    `userId` INT NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Invoice_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- tradeinrequest
CREATE TABLE `tradeinrequest` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `carModel` VARCHAR(255) NOT NULL,
    `year` INT NOT NULL,
    `condition` VARCHAR(255) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT `TradeInRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================
-- NEW TABLES (Phase 1)
-- =========================

-- message (نظام المراسلة بين الزبون والآدمن)
CREATE TABLE `message` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `senderId` INT NOT NULL,
    `receiverId` INT NOT NULL,
    `content` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT FALSE,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- notification (الاشعارات الذكية للزبون)
CREATE TABLE `notification` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT FALSE,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- systemsetting (اعدادات النظام: الوان الموقع، نسبة الضريبة)
CREATE TABLE `systemsetting` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    `value` TEXT NOT NULL,
    `description` VARCHAR(255),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- activitylog (سجل النشاطات)
CREATE TABLE `activitylog` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT,
    `action` VARCHAR(255) NOT NULL,
    `details` TEXT,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- =========================
-- 4. SEED DATA
-- =========================

-- branch
INSERT INTO `branch` (`id`, `name`, `address`, `phone`) VALUES
(1, 'Main Branch', 'Downtown City, Amman', '079-000-0000'),
(2, 'North Branch', 'Irbid City', '02-700-0000');

-- user (Password is 'admin123' hashed for export)
INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `branchId`, `notificationsEnabled`, `colorBlindMode`, `dashboardColor`) VALUES
(1, 'admin@dealer.com', '$2b$10$vI8p7FpND3B7f8D.0O1Q0.hL/9VpC1YyJ/3K0YI4yY5Z.O1Q0.hL/', 'Admin Account', 'ADMIN', 1, TRUE, FALSE, '#ffffff'),
(2, 'employee@dealer.com', '$2b$10$vI8p7FpND3B7f8D.0O1Q0.hL/9VpC1YyJ/3K0YI4yY5Z.O1Q0.hL/', 'Staff Member', 'EMPLOYEE', 1, TRUE, FALSE, '#ffffff'),
(3, 'client@dealer.com', '$2b$10$vI8p7FpND3B7f8D.0O1Q0.hL/9VpC1YyJ/3K0YI4yY5Z.O1Q0.hL/', 'Sample Client', 'CLIENT', NULL, TRUE, FALSE, '#ffffff'),
(4, 'zemo984@gmail.com', 'bmw series 5', 'Zemo Admin', 'ADMIN', 1, TRUE, FALSE, '#ffffff'),
(5, 'customer1@example.com', 'customer123', 'Customer One', 'CLIENT', NULL, TRUE, FALSE, '#ffffff');

-- vehicletype
INSERT INTO `vehicletype` (`id`, `typeName`, `securityDeposit`, `costPerMile`) VALUES
(1, 'Sedan', 500.00, 0.50),
(2, 'SUV', 800.00, 0.80),
(3, 'Luxury', 1500.00, 1.20);

-- car
INSERT INTO `car` (`id`, `make`, `model`, `year`, `price`, `regNumber`, `mileage`, `condition`, `status`, `typeId`, `images`, `listingType`) VALUES
(1, 'BMW', '5 Series', 2024, 55000.00, 'BMW-520-2024', 10, 'New', 'AVAILABLE', 1, '/images/cars/bmw-x5.png', 'SALE'),
(2, 'Mercedes', 'S-Class', 2024, 95000.00, 'MB-S500-2024', 5, 'New', 'AVAILABLE', 3, '/images/cars/mercedes-s.png', 'SALE'),
(3, 'Toyota', 'Camry', 2023, 22000.00, 'TY-CAM-2023', 15000, 'Excellent', 'AVAILABLE', 1, '/images/cars/toyota-camry.png', 'SALE'),
(4, 'Audi', 'A6', 2024, 60000.00, 'AU-A6-2024', 20, 'New', 'AVAILABLE', 1, '/images/cars/audi-a6.png', 'SALE'),
(5, 'Skoda', 'Octavia', 2023, 28000.00, 'SK-OCT-2023', 100, 'Excellent', 'AVAILABLE', 1, '/images/cars/skoda-octavia.png', 'SALE'),
(6, 'Mercedes', 'G-Wagon', 2024, 180000.00, 'MB-G63-2024', 0, 'New', 'AVAILABLE', 2, '/images/cars/g-wagon.png', 'SALE');

-- systemsetting seed (اعدادات افتراضية: ضريبة 10%، لون الموقع الاساسي)
INSERT INTO `systemsetting` (`key`, `value`, `description`) VALUES
('tax_rate', '10', 'نسبة الضريبة المطبقة على الفواتير (%)'),
('primary_color', '#C8A96E', 'اللون الاساسي للموقع'),
('secondary_color', '#1a1a2e', 'اللون الثانوي للموقع');

SET FOREIGN_KEY_CHECKS = 1;

-- END OF EXPORT
