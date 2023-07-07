import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNodeLogoUrl1688561933781 implements MigrationInterface {
    name = 'RemoveNodeLogoUrl1688561933781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_officer" DROP COLUMN "node"`);
        await queryRunner.query(`ALTER TABLE "legal_officer" DROP COLUMN "logo_url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_officer" ADD "logo_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "legal_officer" ADD "node" character varying(255) NOT NULL default ''`);
    }

}
