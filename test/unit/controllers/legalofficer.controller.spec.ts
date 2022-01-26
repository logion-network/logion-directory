import { setupApp } from "../../helpers/testapp";
import { LegalOfficerController } from "../../../src/logion/controllers/legalofficer.controller";
import request from "supertest";

describe("LegalOfficerController", () => {

    it("should fetch all legal officers", async () => {

        const app = setupApp(LegalOfficerController, () => {
        })
        await request(app)
            .get("/api/legal-officer")
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
                expect(response.body.legalOfficers.length).toBe(5)
            });
    });

    it("should fetch one legal officer", async () => {
        const app = setupApp(LegalOfficerController, () => {
        })
        await request(app)
            .get("/api/legal-officer/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
                expect(response.body.address).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
                const userIdentity = response.body.userIdentity;
                expect(userIdentity.firstName).toBe("Patrick")
                expect(userIdentity.lastName).toBe("Gielen")
                expect(userIdentity.email).toBe("patrick@logion.network")
                expect(userIdentity.phoneNumber).toBe("+32 498 237 107")
                let postalAddress = response.body.postalAddress;
                expect(postalAddress.company).toBe("MODERO")
                expect(postalAddress.line1).toBe("Huissier de Justice Etterbeek")
                expect(postalAddress.line2).toBe("Rue Beckers 17")
                expect(postalAddress.postalCode).toBe("1040")
                expect(postalAddress.city).toBe("Etterbeek")
                expect(postalAddress.country).toBe("Belgique")
                expect(response.body.node).toBe("http://localhost:8080")
            });
    })
})
