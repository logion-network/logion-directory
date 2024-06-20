# Directory migration procedure
The following procedure will re-import legal officers data into the correct backend database.

### Prerequisite
This [migration](https://github.com/logion-network/logion-backend-ts/blob/main/src/logion/migration/1718188396630-AddLegalOfficers.ts) must be applied on each target backend.

### Choose an environment

    cd test
or

    cd mvp

Repeat the step 1-4 for each of the following target hosts:

For Test:
`root@test-node01`, `root@test-node02`

For MVP: `root@node02`, `root@node03`, `ubuntu@node09`
 
1. Set the HOST var

```shell
export HOST=root@node02
```

2. Upload file and connect to host

```shell
FULL_HOST=$HOST.logion.network; \
echo $FULL_HOST ; \
scp legal-officers.sql $FULL_HOST:/tmp ; \
scp keep-hosted-llos-$HOST.sql $FULL_HOST:/tmp ; \
ssh $FULL_HOST
```

3. Import data
Run the following commands on the host
```shell
cd logion_docker
docker-compose exec -T private-database psql -U postgres postgres < /tmp/legal-officers.sql
docker-compose exec -T private-database psql -U postgres postgres < /tmp/keep-hosted-llos*.sql
rm /tmp/*.sql
```

4. Exit the host
