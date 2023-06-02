-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CollectionMintStageGroup" ALTER COLUMN "updatedAt" DROP NOT NULL;
