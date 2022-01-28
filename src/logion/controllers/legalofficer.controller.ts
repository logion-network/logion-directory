import { OpenAPIV3 } from "openapi-types";
import { injectable } from "inversify";
import { addTag, setControllerTag, getDefaultResponses, addPathParameter, getRequestBody } from "./doc";
import { Controller, ApiController, HttpGet, Async, HttpPut } from "dinoloop";
import { components } from "./components";
import {
    LegalOfficerRepository,
    LegalOfficerAggregateRoot,
    LegalOfficerDescription,
    LegalOfficerFactory
} from "../model/legalofficer.model";
import { AuthenticationService } from "../services/authentication.service";
import { UnauthorizedException } from "dinoloop/modules/builtin/exceptions/exceptions";
import { requireDefined } from "../lib/assertions";
import { AuthorityService } from "../services/authority.service";

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
        private authorityService: AuthorityService,
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
        return { legalOfficers: legalOfficers.map(this.toView) }
    }

    static getLegalOfficer(spec: OpenAPIV3.Document) {
        const operationObject = spec.paths["/api/legal-officer/{address}"].get!;
        operationObject.summary = "Gets the details of one legal officer";
        operationObject.description = "No authentication required.";
        operationObject.responses = getDefaultResponses("LegalOfficerView");
        addPathParameter(operationObject, 'address', "The Polkadot address of the expected Legal Officer")
    }

    @HttpGet('/:address')
    @Async()
    async getLegalOfficer(address: string): Promise<LegalOfficerView> {
        const legalOfficer = await this.legalOfficerRepository.findByAddress(address)
        if (legalOfficer) {
            return this.toView(legalOfficer)
        }
        throw new Error(`Unknown address: ${ address }`)
    }

    private toView(legalOfficer: LegalOfficerAggregateRoot): LegalOfficerView {
        const description = legalOfficer.getDescription();
        const userIdentity = description.userIdentity;
        const postalAddress = description.postalAddress;
        return {
            address: legalOfficer.address,
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
            node: description.node
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
        addPathParameter(operationObject, 'address', "The Polkadot address of the expected Legal Officer")
    }

    @HttpPut('')
    @Async()
    async createOrUpdateLegalOfficer(createOrUpdate: CreateOrUpdateLegalOfficerView): Promise<LegalOfficerView> {
        const address = this.authenticationService.authenticatedUser(this.request).address;
        if (!await this.authorityService.isLegalOfficer(address)) {
            throw new UnauthorizedException(`${ address } is not a Legal Officer.`)
        }
        const userIdentity = requireDefined(createOrUpdate.userIdentity);
        const postalAddress = requireDefined(createOrUpdate.postalAddress);
        const description:LegalOfficerDescription = {
            userIdentity: {
                firstName: requireDefined(userIdentity.firstName),
                lastName: requireDefined(userIdentity.lastName),
                email: requireDefined(userIdentity.email),
                phoneNumber: requireDefined(userIdentity.phoneNumber),
            },
            postalAddress: {
                company: postalAddress.company || "",
                line1: requireDefined(postalAddress.line1),
                line2: postalAddress.line2 || "",
                postalCode: requireDefined(postalAddress.postalCode),
                city: requireDefined(postalAddress.city),
                country: requireDefined(postalAddress.country),
            },
            additionalDetails: createOrUpdate.additionalDetails || "",
            node: requireDefined(createOrUpdate.node)
        }
        const legalOfficer = this.legalOfficerFactory.newLegalOfficer({ address, description });
        await this.legalOfficerRepository.save(legalOfficer)
        return this.toView(legalOfficer);
    }
}
