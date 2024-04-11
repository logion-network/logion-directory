import { TestDb } from "@logion/rest-api-core";
import { LegalOfficerAggregateRoot, LegalOfficerRepository } from "../../../src/logion/model/legalofficer.model.js";
import { ValidAccountId } from "@logion/node-api";

const { connect, executeScript, disconnect } = TestDb;

describe("LegalOfficerRepository", () => {

    let repository: LegalOfficerRepository;

    beforeEach(async () => {
        await connect([ LegalOfficerAggregateRoot ]);
        await executeScript("test/integration/model/legal_officers.sql");
        repository = new LegalOfficerRepository();
    });

    afterEach(async () => {
        await disconnect();
    });

    it("findByAddress", async () => {
        const account = ValidAccountId.polkadot("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
        let result = await repository.findByAccount(account);
        expect(result?.city).toBe("Etterbeek")
    })

    it("findAll", async () => {
        let result = await repository.findAll();
        expect(result.length).toBe(3)
    })
})
