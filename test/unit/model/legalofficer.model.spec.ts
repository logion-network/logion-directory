import { LegalOfficerFactory, LegalOfficerDescription } from "../../../src/logion/model/legalofficer.model";
import { LEGAL_OFFICERS } from "../../testdata";

describe("LegalOfficerFactory", () => {

    let factory: LegalOfficerFactory = new LegalOfficerFactory();

    it("succeeds to create a LegalOfficerAggregateRoot", async () => {

        LEGAL_OFFICERS.forEach(legalOfficer => {
            testNewLegalOfficer(legalOfficer.address, legalOfficer)
        })
    })

    function testNewLegalOfficer(address: string, legalOfficer: LegalOfficerDescription) {
        let aggregate = factory.newLegalOfficer({ address, description: legalOfficer })
        expect(aggregate.address).toBe(address)
        expect(aggregate.getDescription().userIdentity).toEqual(legalOfficer.userIdentity)
        expect(aggregate.getDescription().postalAddress).toEqual(legalOfficer.postalAddress)
        expect(aggregate.getDescription().additionalDetails).toEqual(legalOfficer.additionalDetails)
        expect(aggregate.getDescription().node).toEqual(legalOfficer.node)
    }
})
