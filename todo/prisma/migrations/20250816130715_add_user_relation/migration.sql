-- AlterTable
CREATE SEQUENCE "public".todo_id_seq;
ALTER TABLE "public"."Todo" ALTER COLUMN "id" SET DEFAULT nextval('"public".todo_id_seq');
ALTER SEQUENCE "public".todo_id_seq OWNED BY "public"."Todo"."id";

-- AlterTable
CREATE SEQUENCE "public".users_id_seq;
ALTER TABLE "public"."Users" ALTER COLUMN "id" SET DEFAULT nextval('"public".users_id_seq');
ALTER SEQUENCE "public".users_id_seq OWNED BY "public"."Users"."id";
