/*
  Warnings:

  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "public".todo_id_seq;
ALTER TABLE "public"."Todo" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('"public".todo_id_seq'),
ALTER COLUMN "completed" SET DEFAULT false;
ALTER SEQUENCE "public".todo_id_seq OWNED BY "public"."Todo"."id";

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
