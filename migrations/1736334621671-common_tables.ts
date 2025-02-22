import { MigrationInterface, QueryRunner } from "typeorm";

export class CommonTables1736334621671 implements MigrationInterface {
    name = 'CommonTables1736334621671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "website" character varying(255), "linkedin_url" character varying(255), CONSTRAINT "UQ_3dacbb3eb4f095e29372ff8e131" UNIQUE ("name"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_COMPANY_NAME" ON "companies" ("name") `);
        await queryRunner.query(`CREATE TYPE "public"."recruiters_role_enum" AS ENUM('admin', 'recruiter')`);
        await queryRunner.query(`CREATE TABLE "recruiters" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(100) NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" "public"."recruiters_role_enum" NOT NULL DEFAULT 'recruiter', "company_id" integer NOT NULL, CONSTRAINT "UQ_67a547d9a83ee186a56393bee90" UNIQUE ("email"), CONSTRAINT "PK_1999e5a8e68fa6c525eed22c970" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recruiters" ADD CONSTRAINT "FK_b1f7a66e621a4b4b5cedc52e3d6" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruiters" DROP CONSTRAINT "FK_b1f7a66e621a4b4b5cedc52e3d6"`);
        await queryRunner.query(`DROP TABLE "recruiters"`);
        await queryRunner.query(`DROP TYPE "public"."recruiters_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_COMPANY_NAME"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
