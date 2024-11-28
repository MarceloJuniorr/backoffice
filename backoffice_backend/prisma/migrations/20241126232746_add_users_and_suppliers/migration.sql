/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Payment`;

-- DropTable
DROP TABLE `Supplier`;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `paymentType` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `dueDate` CHAR(10) NULL,
    `store` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `boletoCode` VARCHAR(191) NULL,
    `paymentDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Payment_supplierId_fkey`(`supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
