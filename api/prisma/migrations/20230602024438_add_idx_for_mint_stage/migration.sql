/*
  Warnings:

  - Added the required column `idx` to the `CollectionMintStage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollectionMintStage" ADD COLUMN     "idx" INTEGER NOT NULL;
