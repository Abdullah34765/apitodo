/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.
  - Made the column `customId` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Todo" ALTER COLUMN "customId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Todo_customId_key" ON "public"."Todo"("customId");
