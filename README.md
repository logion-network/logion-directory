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

