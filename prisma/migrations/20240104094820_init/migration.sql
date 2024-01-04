-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `content` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(100) NOT NULL,
    `updatedAt` TIMESTAMP(0) NULL,
    `updatedBy` VARCHAR(100) NULL,
    `deletedAt` TIMESTAMP(0) NULL,
    `deletedBy` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
