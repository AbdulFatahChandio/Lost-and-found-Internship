-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "depth" SET DEFAULT 3;
