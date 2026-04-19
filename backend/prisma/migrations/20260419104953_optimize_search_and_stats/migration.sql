-- AlterTable
ALTER TABLE `volume` ADD COLUMN `soldCount` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `Series_title_idx` ON `Series`(`title`);

-- CreateIndex
CREATE INDEX `Series_isActive_createdAt_idx` ON `Series`(`isActive`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `Volume_title_idx` ON `Volume`(`title`);

-- RenameIndex
ALTER TABLE `volume` RENAME INDEX `Volume_seriesId_fkey` TO `Volume_seriesId_idx`;

ALTER TABLE `Series` MODIFY `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `Volume` MODIFY `title` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
