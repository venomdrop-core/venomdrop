/*
  Warnings:

  - Added the required column `name` to the `CollectionMintStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CollectionMintStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CollectionMintStage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MintStageType" AS ENUM ('PUBLIC', 'ALLOWLIST');

-- AlterTable
ALTER TABLE "CollectionMintStage" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "type" "MintStageType" NOT NULL;
