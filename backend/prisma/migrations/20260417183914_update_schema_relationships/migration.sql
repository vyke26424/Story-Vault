/*
  Warnings:

  - You are about to drop the column `categoryId` on the `series` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `series` DROP FOREIGN KEY `Series_categoryId_fkey`;

-- DropIndex
DROP INDEX `Series_categoryId_fkey` ON `series`;

-- AlterTable
ALTER TABLE `series` DROP COLUMN `categoryId`;

-- AlterTable
ALTER TABLE `volume` ADD COLUMN `volumeNumber` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `_CategoryToSeries` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToSeries_AB_unique`(`A`, `B`),
    INDEX `_CategoryToSeries_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoryToSeries` ADD CONSTRAINT `_CategoryToSeries_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToSeries` ADD CONSTRAINT `_CategoryToSeries_B_fkey` FOREIGN KEY (`B`) REFERENCES `Series`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
