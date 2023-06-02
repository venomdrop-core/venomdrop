/*
  Warnings:

  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CollectionMintStageGroup" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionMintStageGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionMintStage" (
    "id" TEXT NOT NULL,
    "mintStageGroupId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "allowlistData" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "CollectionMintStage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionMintStageGroup" ADD CONSTRAINT "CollectionMintStageGroup_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionMintStage" ADD CONSTRAINT "CollectionMintStage_mintStageGroupId_fkey" FOREIGN KEY ("mintStageGroupId") REFERENCES "CollectionMintStageGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
