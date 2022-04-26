# logion-directory
Logion legal officers directory

## Initial setup

1. Start a database:

   `docker run --name logion-postgres-directory -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:12`

   (or `docker start -a logion-postgres-directory` for a subsequent start).

2. Create a config file `ormconfig.json` based on [`ormconfig.json.sample`](ormconfig.json.sample).

3. Create the schema: `yarn typeorm migration:run`
4. Populate the DB with legal officers (using well-known polkadot account) : [`legal_officers.sql`](test/integration/model/legal_officers.sql)
5. Start the server: `yarn start`

## Change DB schema

1. Adapt the model with the proper annotations.
2. Choose a name for the migration, for instance `MyMigration` 
3. Run `yarn typeorm migration:generate -n MyMigration` - this will generate a new migration `TIMESTAMP-MyMigration.ts` under [migration](/src/logion/migration).
4. (Optional) Fix the generated file.
5. Apply the migration(s): `yarn typeorm migration:run`
6. (Optional) Revert the last migration: `yarn typeorm migration:revert`
