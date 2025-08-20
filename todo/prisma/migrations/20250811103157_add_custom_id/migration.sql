-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "customId" INTEGER,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Student_id_seq";
