import { MigrationInterface, QueryRunner } from "typeorm";

export class ComonTables1737312394334 implements MigrationInterface {
    name = 'ComonTables1737312394334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."prescreens_status_enum" AS ENUM('not_started', 'in_progress', 'completed', 'expired')`);
        await queryRunner.query(`CREATE TABLE "prescreens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "candidate_email" character varying(100) NOT NULL, "candidate_first_name" character varying(50) NOT NULL, "candidate_last_name" character varying(50), "token" character varying(100) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."prescreens_status_enum" NOT NULL DEFAULT 'not_started', "recruiter_id" integer, CONSTRAINT "UQ_067a2660e7c017d1742503e2b5f" UNIQUE ("token"), CONSTRAINT "PK_9be22eaff9c4adc3d0fbe62779a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_pools" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(150) NOT NULL, "description" text, "created_by_recruiter_id" integer, CONSTRAINT "PK_9939b2fbca4830ae489d36d8547" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_lists" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(150) NOT NULL, "description" text, "created_by_recruiter_id" integer, CONSTRAINT "UQ_c3ac6225ea7eebbbc789626285c" UNIQUE ("title"), CONSTRAINT "PK_120c4aa244436b961efbf7af216" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."questions_type_enum" AS ENUM('TEXT', 'VIDEO', 'CODE', 'MULTIPLE_CHOICE')`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "text" text NOT NULL, "type" "public"."questions_type_enum" NOT NULL DEFAULT 'TEXT', "options" jsonb, "question_pool_id" integer, "question_list_id" integer NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "prescreens" ADD CONSTRAINT "FK_3e5681133c3b05016cac99750cc" FOREIGN KEY ("recruiter_id") REFERENCES "recruiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_pools" ADD CONSTRAINT "FK_415f371fdca8649d0a712d00754" FOREIGN KEY ("created_by_recruiter_id") REFERENCES "recruiters"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_lists" ADD CONSTRAINT "FK_e03fd471aa522cf760419b5ff98" FOREIGN KEY ("created_by_recruiter_id") REFERENCES "recruiters"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_9aad1f11d082c837b72181687fc" FOREIGN KEY ("question_pool_id") REFERENCES "question_pools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_085b18ff43f25cd65c5aac5f2c1" FOREIGN KEY ("question_list_id") REFERENCES "question_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_085b18ff43f25cd65c5aac5f2c1"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_9aad1f11d082c837b72181687fc"`);
        await queryRunner.query(`ALTER TABLE "question_lists" DROP CONSTRAINT "FK_e03fd471aa522cf760419b5ff98"`);
        await queryRunner.query(`ALTER TABLE "question_pools" DROP CONSTRAINT "FK_415f371fdca8649d0a712d00754"`);
        await queryRunner.query(`ALTER TABLE "prescreens" DROP CONSTRAINT "FK_3e5681133c3b05016cac99750cc"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
        await queryRunner.query(`DROP TABLE "question_lists"`);
        await queryRunner.query(`DROP TABLE "question_pools"`);
        await queryRunner.query(`DROP TABLE "prescreens"`);
        await queryRunner.query(`DROP TYPE "public"."prescreens_status_enum"`);
    }

}
