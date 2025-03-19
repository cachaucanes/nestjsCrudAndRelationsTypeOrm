import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742242207499 implements MigrationInterface {
    name = 'Migration1742242207499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "city" character varying(80) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "city"`);
    }

}
