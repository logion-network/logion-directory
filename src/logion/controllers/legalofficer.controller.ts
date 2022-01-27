import { OpenAPIV3 } from "openapi-types";
import { injectable } from "inversify";
import { addTag, setControllerTag, getDefaultResponses, addPathParameter } from "./doc";
import { Controller, ApiController, HttpGet, Async } from "dinoloop";
import { components } from "./components";
import { LegalOfficerRepository, LegalOfficerAggregateRoot } from "../model/legalofficer.model";

export function fillInSpec(spec: OpenAPIV3.Document): void {
    const tagName = 'Legal Officers';
    addTag(spec, {
        name: tagName,
        description: "Retrieval and Management of Legal Officers details"
    });
    setControllerTag(spec, /^\/api\/legal-officer.*/, tagName);

    LegalOfficerController.fetchLegalOfficers(spec);
    LegalOfficerController.getLegalOfficer(spec);
}

type LegalOfficerView = components["schemas"]["LegalOfficerView"]
type FetchLegalOfficersView = components["schemas"]["FetchLegalOfficersView"]

@injectable()
@Controller('/legal-officer')
export class LegalOfficerController extends ApiController {

    constructor(
        private legalOfficerRepository: LegalOfficerRepository) {
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
        throw new Error(`Unknown address: ${address}`)
    }

    private toView(legalOfficer: LegalOfficerAggregateRoot): LegalOfficerView {
        const description = legalOfficer.getDescription();
        const userIdentity = description.userIdentity;
        const postalAddress = description.postalAddress;
        return {
            address: description.address,
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
}
