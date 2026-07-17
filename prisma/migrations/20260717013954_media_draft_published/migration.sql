/*
  Warnings:

  - You are about to drop the column `alt` on the `MediaAsset` table. All the data in the column will be lost.
  - You are about to drop the column `focalX` on the `MediaAsset` table. All the data in the column will be lost.
  - You are about to drop the column `focalY` on the `MediaAsset` table. All the data in the column will be lost.
  - You are about to drop the column `scale` on the `MediaAsset` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `MediaAsset` table. All the data in the column will be lost.
  - Added the required column `draft` to the `MediaAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published` to the `MediaAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MediaAsset" DROP COLUMN "alt",
DROP COLUMN "focalX",
DROP COLUMN "focalY",
DROP COLUMN "scale",
DROP COLUMN "url",
ADD COLUMN     "draft" JSONB NOT NULL,
ADD COLUMN     "published" JSONB NOT NULL;
