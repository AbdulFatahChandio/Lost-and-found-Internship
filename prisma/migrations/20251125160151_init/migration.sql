/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."ReactionType" ADD VALUE 'SAD';

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_postId_userId_key" ON "public"."Reaction"("postId", "userId");
