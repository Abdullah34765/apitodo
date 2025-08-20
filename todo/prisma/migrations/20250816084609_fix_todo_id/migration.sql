-- AlterTable
ALTER TABLE "public"."Todo" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "completed" DROP DEFAULT;
DROP SEQUENCE "todo_id_seq";
