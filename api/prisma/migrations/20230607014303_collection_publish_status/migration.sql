-- CreateEnum
CREATE TYPE "CollectionPublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "publishStatus" "CollectionPublishStatus" NOT NULL DEFAULT 'DRAFT';
