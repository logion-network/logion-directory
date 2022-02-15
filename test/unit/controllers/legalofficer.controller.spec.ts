import { setupApp } from "../../helpers/testapp";
import { LegalOfficerController } from "../../../src/logion/controllers/legalofficer.controller";
import request from "supertest";
import { Container } from "inversify";
import { Mock, It } from "moq.ts";
import {
    LegalOfficerRepository,
    LegalOfficerAggregateRoot,
    LegalOfficerFactory,
    LegalOfficerDescription,
} from "../../../src/logion/model/legalofficer.model";
import { LEGAL_OFFICERS } from "../../testdata";
import { AuthenticationService, LogionUserCheck } from "../../../src/logion/services/authentication.service";
import { Request } from "express";
import { Promise } from "mongoose";
import { AuthorityService } from "../../../src/logion/services/authority.service";
import { LegalOfficerDataMergeService } from "../../../src/logion/services/legalofficerdatamerge.service";

const AUTHENTICATED_ADDRESS = LEGAL_OFFICERS[0].address;

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
        const app = setupApp(LegalOfficerController, mockRepository)
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
        const app = setupApp(LegalOfficerController, (container) => mockRepository(container, false))
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
        .returns((address: string) => Promise.resolve(LEGAL_OFFICERS.find(description => description.address === address)))

    const factory = new Mock<LegalOfficerFactory>();
    container.bind(LegalOfficerFactory).toConstantValue(factory.object());

    const authenticationService = new Mock<AuthenticationService>();
    container.bind(AuthenticationService).toConstantValue(authenticationService.object());
    authenticationService.setup(instance => instance.authenticatedUser(It.IsAny<Request>()))
        .returns(new LogionUserCheck({address: AUTHENTICATED_ADDRESS, legalOfficer:true}));

    const authorityService = new Mock<AuthorityService>();
    container.bind(AuthorityService).toConstantValue(authorityService.object());
}

function mockRepository(container: Container, authenticatedAddressIsLegalOfficer: boolean = true) {
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
    container.bind(LegalOfficerDataMergeService).toConstantValue(dataMergeService.object());

    const factory = new Mock<LegalOfficerFactory>();
    container.bind(LegalOfficerFactory).toConstantValue(factory.object())
    factory.setup(instance => instance.newLegalOfficer(It.IsAny<LegalOfficerDescription>()))
        .returns(legalOfficer0)

    const authenticationService = new Mock<AuthenticationService>()
    container.bind(AuthenticationService).toConstantValue(authenticationService.object())
    authenticationService.setup(instance => instance.authenticatedUser(It.IsAny<Request>()))
        .returns(new LogionUserCheck({address: AUTHENTICATED_ADDRESS, legalOfficer:true}))

    const authorityService = new Mock<AuthorityService>()
    container.bind(AuthorityService).toConstantValue(authorityService.object())

    if (authenticatedAddressIsLegalOfficer) {
        authorityService.setup(instance => instance.isLegalOfficer(It.Is<string>(address => address === AUTHENTICATED_ADDRESS)))
            .returns(Promise.resolve(true))
    } else {
        authorityService.setup(instance => instance.isLegalOfficer(It.IsAny<string>()))
            .returns(Promise.resolve(false))
    }
}

function mockLegalOfficer(repository: Mock<LegalOfficerRepository>, idx:number):LegalOfficerAggregateRoot {
    const legalOfficer = new Mock<LegalOfficerAggregateRoot>();
    legalOfficer.setup(instance => instance.getDescription()).returns(LEGAL_OFFICERS[idx])
    legalOfficer.setup(instance => instance.address).returns(LEGAL_OFFICERS[idx].address)
    repository.setup(instance => instance.findByAddress(It.Is<string>(address => address === LEGAL_OFFICERS[idx].address)))
        .returns(Promise.resolve(legalOfficer.object()))
    return legalOfficer.object();
}
