import { connect, executeScript, disconnect } from "../../helpers/testdb";
import { LegalOfficerAggregateRoot, LegalOfficerRepository } from "../../../src/logion/model/legalofficer.model";

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
        let result = await repository.findByAddress("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
        expect(result?.city).toBe("Etterbeek")
    })

    it("findAll", async () => {
        let result = await repository.findAll();
        expect(result.length).toBe(3)
    })
})
