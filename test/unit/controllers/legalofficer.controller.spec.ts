import { TestApp } from "@logion/rest-api-core";
import request from "supertest";
import { Container } from "inversify";
import { Mock, It } from "moq.ts";

import { LegalOfficerController } from "../../../src/logion/controllers/legalofficer.controller.js";
import {
    LegalOfficerRepository,
    LegalOfficerAggregateRoot,
    LegalOfficerFactory,
    LegalOfficerDescription,
} from "../../../src/logion/model/legalofficer.model.js";
import { LEGAL_OFFICERS } from "../../testdata.js";
import { LegalOfficerDataMergeService } from "../../../src/logion/services/legalofficerdatamerge.service.js";

const AUTHENTICATED_ADDRESS = LEGAL_OFFICERS[0].address;
const { setupApp, mockAuthenticationForUserOrLegalOfficer } = TestApp;

describe("LegalOfficerController", () => {

    it("should fetch all legal officers", async () => {

        const app = setupApp(LegalOfficerController, mockDataMergeService)
        await request(app)
            .get("/api/legal-officer")
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
                expect(response.body.legalOfficers.length).toBe(LEGAL_OFFICERS.length)
            });
    });

    it("should fetch one legal officer", async () => {
        const app = setupApp(LegalOfficerController, mockDataMergeService)
        await request(app)
            .get("/api/legal-officer/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
                expect(response.body.address).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
                const userIdentity = response.body.userIdentity;
                expect(userIdentity.firstName).toBe("Alice")
                expect(userIdentity.lastName).toBe("Alice")
                expect(userIdentity.email).toBe("alice@logion.network")
                expect(userIdentity.phoneNumber).toBe("+32 498 00 00 00")
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

    it("creates or updates details for a legal officer", async () => {
        const payload = { ...LEGAL_OFFICERS[0] }
        const app = setupApp(LegalOfficerController, mockRepository, mockAuthenticationForUserOrLegalOfficer(true, AUTHENTICATED_ADDRESS))
        await request(app)
            .put("/api/legal-officer")
            .send(payload)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .then(response => {
                expect(response.body.address).toBe(AUTHENTICATED_ADDRESS)
                const userIdentity = response.body.userIdentity;
                expect(userIdentity.firstName).toBe("Alice")
                expect(userIdentity.lastName).toBe("Alice")
                expect(userIdentity.email).toBe("alice@logion.network")
                expect(userIdentity.phoneNumber).toBe("+32 498 00 00 00")
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

    it("fails to create or update details for a legal officer", async () => {
        const payload = { ...LEGAL_OFFICERS[0] }
        const app = setupApp(LegalOfficerController, mockRepository, mockAuthenticationForUserOrLegalOfficer(false))
        await request(app)
            .put("/api/legal-officer")
            .send(payload)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

function mockDataMergeService(container: Container) {
    const repository = new Mock<LegalOfficerRepository>();
    container.bind(LegalOfficerRepository).toConstantValue(repository.object());

    const dataMergeService = new Mock<LegalOfficerDataMergeService>();
    container.bind(LegalOfficerDataMergeService).toConstantValue(dataMergeService.object());
    dataMergeService.setup(instance => instance.getAllLegalOfficers())
        .returns(Promise.resolve(LEGAL_OFFICERS))
    dataMergeService.setup(instance => instance.getLegalOfficer)
        .returns((address: string) => Promise.resolve(LEGAL_OFFICERS.find(description => description.address === address)!))

    const factory = new Mock<LegalOfficerFactory>();
    container.bind(LegalOfficerFactory).toConstantValue(factory.object());
}

function mockRepository(container: Container) {
    const repository = new Mock<LegalOfficerRepository>();
    container.bind(LegalOfficerRepository).toConstantValue(repository.object())
    const legalOfficer0 = mockLegalOfficer(repository, 0);
    const legalOfficers = [
        legalOfficer0,
        mockLegalOfficer(repository, 1),
        mockLegalOfficer(repository, 2),
    ];
    repository.setup(instance => instance.findAll())
        .returns(Promise.resolve(legalOfficers))
    repository.setup(instance => instance.save(It.IsAny<LegalOfficerAggregateRoot>()))
        .returns(Promise.resolve())

    const dataMergeService = new Mock<LegalOfficerDataMergeService>();
    dataMergeService.setup(instance => instance.getLegalOfficer)
        .returns((address: string) => Promise.resolve(LEGAL_OFFICERS.find(description => description.address === address)!));
    container.bind(LegalOfficerDataMergeService).toConstantValue(dataMergeService.object());

    const factory = new Mock<LegalOfficerFactory>();
    container.bind(LegalOfficerFactory).toConstantValue(factory.object())
    factory.setup(instance => instance.newLegalOfficer(It.IsAny<LegalOfficerDescription>()))
        .returns(legalOfficer0)
}

function mockLegalOfficer(repository: Mock<LegalOfficerRepository>, idx:number):LegalOfficerAggregateRoot {
    const legalOfficer = new Mock<LegalOfficerAggregateRoot>();
    legalOfficer.setup(instance => instance.getDescription()).returns(LEGAL_OFFICERS[idx])
    legalOfficer.setup(instance => instance.address).returns(LEGAL_OFFICERS[idx].address)
    repository.setup(instance => instance.findByAddress(It.Is<string>(address => address === LEGAL_OFFICERS[idx].address)))
        .returns(Promise.resolve(legalOfficer.object()))
    return legalOfficer.object();
}
