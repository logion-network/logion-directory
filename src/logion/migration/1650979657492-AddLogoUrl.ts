import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLogoUrl1650979657492 implements MigrationInterface {
    name = 'AddLogoUrl1650979657492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_officer" ADD "logo_url" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_officer" DROP COLUMN "logo_url"`);
    }

}
