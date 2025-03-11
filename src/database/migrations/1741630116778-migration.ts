import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741630116778 implements MigrationInterface {
    name = 'Migration1741630116778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "lastName" TO "last_name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "last_name" TO "lastName"`);
    }

}
