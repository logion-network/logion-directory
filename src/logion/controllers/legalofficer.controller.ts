import { addTag, setControllerTag, getDefaultResponses, setPathParameters, getRequestBody, AuthenticationService, requireDefined } from "@logion/rest-api-core";
import { OpenAPIV3 } from "openapi-types";
import { injectable } from "inversify";
import { Controller, ApiController, HttpGet, Async, HttpPut } from "dinoloop";
import { UnauthorizedException } from "dinoloop/modules/builtin/exceptions/exceptions.js";

import { components } from "./components.js";
import {
    LegalOfficerRepository,
    LegalOfficerDescription,
    LegalOfficerFactory,
} from "../model/legalofficer.model.js";
import { ValidAccountId } from "@logion/node-api";

export function fillInSpec(spec: OpenAPIV3.Document): void {
    const tagName = 'Legal Officers';
    addTag(spec, {
        name: tagName,
        description: "Retrieval and Management of Legal Officers details"
    });
    setControllerTag(spec, /^\/api\/legal-officer.*/, tagName);

    LegalOfficerController.fetchLegalOfficers(spec);
    LegalOfficerController.getLegalOfficer(spec);
    LegalOfficerController.createOrUpdateLegalOfficer(spec);
}

type LegalOfficerView = components["schemas"]["LegalOfficerView"]
type FetchLegalOfficersView = components["schemas"]["FetchLegalOfficersView"]
type CreateOrUpdateLegalOfficerView = components["schemas"]["CreateOrUpdateLegalOfficerView"]

@injectable()
@Controller('/legal-officer')
export class LegalOfficerController extends ApiController {

    constructor(
        private legalOfficerRepository: LegalOfficerRepository,
        private legalOfficerFactory: LegalOfficerFactory,
        private authenticationService: AuthenticationService,
        ) {
        super();
    }

    static fetchLegalOfficers(spec: OpenAPIV3.Document) {
        const operationObject = spec.paths["/api/legal-officer"].get!;
        operationObject.summary = "Gets the list of all legal officers";
        operationObject.description = "No authentication required.";
        operationObject.responses = getDefaultResponses("FetchLegalOfficersView");
    }

    @HttpGet('')
    @Async()
    async fetchLegalOfficers(): Promise<FetchLegalOfficersView> {
        const legalOfficers = await this.legalOfficerRepository.findAll();
        return { legalOfficers: legalOfficers.map(legalOfficer => legalOfficer.getDescription()).map(this.toView) }
    }

    static getLegalOfficer(spec: OpenAPIV3.Document) {
        const operationObject = spec.paths["/api/legal-officer/{address}"].get!;
        operationObject.summary = "Gets the details of one legal officer";
        operationObject.description = "No authentication required.";
        operationObject.responses = getDefaultResponses("LegalOfficerView");
        setPathParameters(operationObject, {
            address: "The Polkadot address of the expected Legal Officer"
        })
    }

    @HttpGet('/:address')
    @Async()
    async getLegalOfficer(address: string): Promise<LegalOfficerView> {
        const account = ValidAccountId.polkadot(address);
        const legalOfficer = await this.legalOfficerRepository.findByAccount(account);
        if (legalOfficer) {
            return this.toView(legalOfficer.getDescription());
        } else {
            throw new Error("No legal officer with given address");
        }
    }

    private toView(description: LegalOfficerDescription): LegalOfficerView {
        const userIdentity = description.userIdentity;
        const postalAddress = description.postalAddress;
        return {
            address: description.account.address,
            userIdentity: {
                firstName: userIdentity.firstName,
                lastName: userIdentity.lastName,
                email: userIdentity.email,
                phoneNumber: userIdentity.phoneNumber,
            },
            postalAddress: {
                company: postalAddress.company,
                line1: postalAddress.line1,
                line2: postalAddress.line2,
                postalCode: postalAddress.postalCode,
                city: postalAddress.city,
                country: postalAddress.country,
            },
            additionalDetails: description.additionalDetails,
        }
    }

    static createOrUpdateLegalOfficer(spec: OpenAPIV3.Document) {
        const operationObject = spec.paths["/api/legal-officer"].put!;
        operationObject.summary = "Creates or updates the details of a legal officer";
        operationObject.description = ".";
        operationObject.requestBody = getRequestBody({
            description: "Legal Officer details to be created/updated",
            view: "CreateOrUpdateLegalOfficerView"
        })
        operationObject.responses = getDefaultResponses("LegalOfficerView");
        setPathParameters(operationObject, {
            address: "The Polkadot address of the expected Legal Officer"
        })
    }

    @HttpPut('')
    @Async()
    async createOrUpdateLegalOfficer(createOrUpdate: CreateOrUpdateLegalOfficerView): Promise<LegalOfficerView> {
        const authenticatedUser = await this.authenticationService.authenticatedUser(this.request);
        const account = authenticatedUser.validAccountId;
        if (!await authenticatedUser.isLegalOfficer()) {
            throw new UnauthorizedException(`${ account.address } is not a Legal Officer.`);
        }
        const userIdentity = requireDefined(createOrUpdate.userIdentity);
        const postalAddress = requireDefined(createOrUpdate.postalAddress);
        const description: LegalOfficerDescription = {
            account,
            userIdentity: {
                firstName: userIdentity.firstName || "",
                lastName: userIdentity.lastName || "",
                email: userIdentity.email || "",
                phoneNumber: userIdentity.phoneNumber || "",
            },
            postalAddress: {
                company: postalAddress.company || "",
                line1: postalAddress.line1 || "",
                line2: postalAddress.line2 || "",
                postalCode: postalAddress.postalCode || "",
                city: postalAddress.city || "",
                country: postalAddress.country || "",
            },
            additionalDetails: createOrUpdate.additionalDetails || "",
        }
        const legalOfficer = this.legalOfficerFactory.newLegalOfficer(description);
        await this.legalOfficerRepository.save(legalOfficer);

        return this.toView(legalOfficer.getDescription());
    }
}
