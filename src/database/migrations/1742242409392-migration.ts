import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742242409392 implements MigrationInterface {
    name = 'Migration1742242409392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "city" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "city" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "address" SET DEFAULT ''`);
    }

}
