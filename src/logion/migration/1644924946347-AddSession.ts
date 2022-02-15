import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSession1644924946347 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (!await queryRunner.hasTable("session")) {
            await queryRunner.query(`CREATE TABLE "session"
                                     (
                                         "user_address" character varying(255) NOT NULL,
                                         "session_id"   uuid                   NOT NULL,
                                         "created_on"   TIMESTAMP,
                                         CONSTRAINT "PK_session" PRIMARY KEY ("user_address")
                                     )`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
