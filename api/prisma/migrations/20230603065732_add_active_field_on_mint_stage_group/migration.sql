/*
  Warnings:

  - You are about to drop the column `active` on the `CollectionMintStage` table. All the data in the column will be lost.
  - Added the required column `active` to the `CollectionMintStageGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollectionMintStage" DROP COLUMN "active";

-- AlterTable
ALTER TABLE "CollectionMintStageGroup" ADD COLUMN     "active" BOOLEAN NOT NULL;
