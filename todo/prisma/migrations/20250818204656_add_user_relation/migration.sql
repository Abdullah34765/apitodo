/*
  Warnings:

  - You are about to drop the column `customId` on the `Todo` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Todo_customId_key";

-- AlterTable
ALTER TABLE "public"."Todo" DROP COLUMN "customId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "completed" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
