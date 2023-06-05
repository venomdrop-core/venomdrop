-- CreateTable
CREATE TABLE "CollectionRevealedToken" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "metadataJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CollectionRevealedToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionRevealedToken" ADD CONSTRAINT "CollectionRevealedToken_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
