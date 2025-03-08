import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740959340927 implements MigrationInterface {
    name = 'Migration1740959340927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "status" character varying(20) NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(255) NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "idCustomer" integer, CONSTRAINT "REL_c32f4bf2789f28e353de9adbd3" UNIQUE ("idCustomer"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "image" character varying(255) NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "image" character varying NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "idBrand" integer, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_categories_mtm" ("idCategory" integer NOT NULL, "idProduct" integer NOT NULL, CONSTRAINT "PK_e7686cebce3bff8a4774b4d3ee3" PRIMARY KEY ("idCategory", "idProduct"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dca5603fe2b9ba15b557da1c38" ON "products_categories_mtm" ("idCategory") `);
        await queryRunner.query(`CREATE INDEX "IDX_21d35b9d475956bc059360670d" ON "products_categories_mtm" ("idProduct") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c32f4bf2789f28e353de9adbd3c" FOREIGN KEY ("idCustomer") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_019d6498d9997ef3836f33668f3" FOREIGN KEY ("idBrand") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories_mtm" ADD CONSTRAINT "FK_dca5603fe2b9ba15b557da1c382" FOREIGN KEY ("idCategory") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories_mtm" ADD CONSTRAINT "FK_21d35b9d475956bc059360670dd" FOREIGN KEY ("idProduct") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_categories_mtm" DROP CONSTRAINT "FK_21d35b9d475956bc059360670dd"`);
        await queryRunner.query(`ALTER TABLE "products_categories_mtm" DROP CONSTRAINT "FK_dca5603fe2b9ba15b557da1c382"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_019d6498d9997ef3836f33668f3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c32f4bf2789f28e353de9adbd3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21d35b9d475956bc059360670d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dca5603fe2b9ba15b557da1c38"`);
        await queryRunner.query(`DROP TABLE "products_categories_mtm"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
