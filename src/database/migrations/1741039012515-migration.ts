import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741039012515 implements MigrationInterface {
    name = 'Migration1741039012515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_items_mtm" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "quantity" integer NOT NULL, "idProduct" integer, "idOrder" integer, CONSTRAINT "PK_990ed142ae7ebd3b1763b7b2b47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items_mtm" ADD CONSTRAINT "FK_88ff31037a726c9df85796ea743" FOREIGN KEY ("idProduct") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items_mtm" ADD CONSTRAINT "FK_03ff4ab957f2387c5484529707b" FOREIGN KEY ("idOrder") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
        await queryRunner.query(`ALTER TABLE "order_items_mtm" DROP CONSTRAINT "FK_03ff4ab957f2387c5484529707b"`);
        await queryRunner.query(`ALTER TABLE "order_items_mtm" DROP CONSTRAINT "FK_88ff31037a726c9df85796ea743"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_items_mtm"`);
    }

}
