import { injectable } from 'inversify';
import { LegalOfficerDescription, LegalOfficerRepository } from "../model/legalofficer.model";
import { PolkadotService } from './polkadot.service';

@injectable()
export class LegalOfficerDataMergeService {

    constructor(
        private legalOfficerRepository: LegalOfficerRepository,
        private polkadotService: PolkadotService,
    ) {}

    async getAllLegalOfficers(): Promise<LegalOfficerDescription[]> {
        const dbLegalOfficers = await this.legalOfficerRepository.findAll();
        const dbLegalOfficersMap: Record<string, LegalOfficerDescription> = {};
        dbLegalOfficers.map(root => root.getDescription()).forEach(description => dbLegalOfficersMap[description.address] = description);

        const api = await this.polkadotService.readyApi();
        const chainLegalOfficers = await api.query.loAuthorityList.legalOfficerSet.entries();

        const fullList: LegalOfficerDescription[] = [];
        for(let i = 0; i < chainLegalOfficers.length; ++i) {
            if(chainLegalOfficers[i][1].isSome) {
                const address = (chainLegalOfficers[i][0].toHuman() as string[])[0];
                if(address in dbLegalOfficersMap) {
                    fullList.push(dbLegalOfficersMap[address]);
                } else {
                    fullList.push(this.emptyLegalOfficer(address));
                }
            }
        }
        fullList.sort((lo1, lo2) => lo1.userIdentity.lastName.localeCompare(lo2.userIdentity.lastName));
        return fullList;
    }

    private emptyLegalOfficer(address: string): LegalOfficerDescription {
        return {
            address,
            userIdentity: {
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
            },
            postalAddress: {
                company: "",
                line1: "",
                line2: "",
                postalCode: "",
                city: "",
                country: "",
            },
            additionalDetails: "",
            node: "",
            logoUrl: "",
        };
    }

    async getLegalOfficer(address: string): Promise<LegalOfficerDescription> {
        const api = await this.polkadotService.readyApi();
        const chainLegalOfficer = await api.query.loAuthorityList.legalOfficerSet(address);
        if(chainLegalOfficer.isSome) {
            const dbLegalOfficer = await this.legalOfficerRepository.findByAddress(address);
            if(dbLegalOfficer) {
                return dbLegalOfficer.getDescription();
            } else {
                return this.emptyLegalOfficer(address);
            }
        } else {
            throw new Error("No legal officer with given address");
        }
    }
}
