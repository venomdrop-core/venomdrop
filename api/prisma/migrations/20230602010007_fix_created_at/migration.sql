-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CollectionMintStageGroup" ALTER COLUMN "createdAt" DROP NOT NULL;
