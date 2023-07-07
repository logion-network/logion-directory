import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNode1688561933781 implements MigrationInterface {
    name = 'RemoveNode1688561933781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_officer" DROP COLUMN "node"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_officer" ADD "node" character varying(255) NOT NULL default ''`);
    }

}
