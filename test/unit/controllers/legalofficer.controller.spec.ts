import { setupApp } from "../../helpers/testapp";
import { LegalOfficerController } from "../../../src/logion/controllers/legalofficer.controller";
import request, { Response } from "supertest";

describe("LegalOfficerController", () => {

    it("should fetch all legal officers", async () => {

        const app = setupApp(LegalOfficerController, container => {
        })
        await request(app)
            .get("/api/legal-officer")
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
                expect(response.body.legalOfficers.length).toBe(3)
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
                expect(response.body.userIdentity.firstName).toBe("Patrick")
                expect(response.body.userIdentity.lastName).toBe("Gielen")
                expect(response.body.userIdentity.email).toBe("patrick@logion.network")
                expect(response.body.userIdentity.phoneNumber).toBe("+32 498 237 107")
                expect(response.body.details).toBe("MODERO\nHuissier de Justice Etterbeek\nRue Beckers 17\n1040 Etterbeek\nBelgique")
                expect(response.body.node).toBe("http://localhost:8080")
            });
    })
})
