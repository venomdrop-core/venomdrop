/*
  Warnings:

  - Added the required column `address` to the `CollectionRevealedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollectionRevealedToken" ADD COLUMN     "address" TEXT NOT NULL;
