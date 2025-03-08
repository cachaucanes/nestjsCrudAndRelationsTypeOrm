import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741217320116 implements MigrationInterface {
    name = 'Migration1741217320116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_2a432ec72f3dd1b353248259484"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "customerId" TO "idCustomer"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_2a432ec72f3dd1b353248259484"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "idCustomer"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9feeb5a7fa9f38a235c3b5e0c96" FOREIGN KEY ("idCustomer") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9feeb5a7fa9f38a235c3b5e0c96"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "idCustomer" integer`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_2a432ec72f3dd1b353248259484" UNIQUE ("idCustomer")`);
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "idCustomer" TO "customerId"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_2a432ec72f3dd1b353248259484" FOREIGN KEY ("idCustomer") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
