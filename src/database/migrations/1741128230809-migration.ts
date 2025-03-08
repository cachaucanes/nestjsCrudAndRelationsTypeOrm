import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741128230809 implements MigrationInterface {
    name = 'Migration1741128230809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "idCustomer" integer`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_2a432ec72f3dd1b353248259484" UNIQUE ("idCustomer")`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_2a432ec72f3dd1b353248259484" FOREIGN KEY ("idCustomer") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_2a432ec72f3dd1b353248259484"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_2a432ec72f3dd1b353248259484"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "idCustomer"`);
    }

}
