-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'CONFIRMED');

-- CreateTable
CREATE TABLE "ItemMatch" (
    "id" SERIAL NOT NULL,
    "lostPostId" INTEGER NOT NULL,
    "foundPostId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemMatch_lostPostId_idx" ON "ItemMatch"("lostPostId");

-- CreateIndex
CREATE INDEX "ItemMatch_foundPostId_idx" ON "ItemMatch"("foundPostId");

-- CreateIndex
CREATE INDEX "ItemMatch_score_idx" ON "ItemMatch"("score");

-- CreateIndex
CREATE UNIQUE INDEX "ItemMatch_lostPostId_foundPostId_key" ON "ItemMatch"("lostPostId", "foundPostId");

-- AddForeignKey
ALTER TABLE "ItemMatch" ADD CONSTRAINT "ItemMatch_lostPostId_fkey" FOREIGN KEY ("lostPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemMatch" ADD CONSTRAINT "ItemMatch_foundPostId_fkey" FOREIGN KEY ("foundPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
