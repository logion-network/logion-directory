import "@logion/node-api/dist/interfaces/types-lookup";
import { PolkadotService } from '@logion/rest-api-core';
import { PalletLoAuthorityListLegalOfficerData } from "@polkadot/types/lookup";
import { injectable } from 'inversify';

import { LegalOfficerAggregateRoot, LegalOfficerDescription, LegalOfficerRepository } from "../model/legalofficer.model";

@injectable()
export class LegalOfficerDataMergeService {

    constructor(
        private legalOfficerRepository: LegalOfficerRepository,
        private polkadotService: PolkadotService,
    ) {}

    async getAllLegalOfficers(): Promise<LegalOfficerDescription[]> {
        const dbLegalOfficers = await this.legalOfficerRepository.findAll();
        const dbLegalOfficersMap: Record<string, LegalOfficerAggregateRoot> = {};
        dbLegalOfficers.forEach(description => dbLegalOfficersMap[description.address!] = description);

        const api = await this.polkadotService.readyApi();
        const chainLegalOfficersMap: Record<string, PalletLoAuthorityListLegalOfficerData> = {};
        const chainLegalOfficers = await api.query.loAuthorityList.legalOfficerSet.entries();
        chainLegalOfficers.forEach(entry => {
            const address = (entry[0].toHuman() as string[])[0];
            const data = entry[1];
            if(data.isSome) {
                chainLegalOfficersMap[address] = data.unwrap();
            }
        });

        const fullList: LegalOfficerDescription[] = [];
        for(const address of Object.keys(chainLegalOfficersMap)) {
            if(address in dbLegalOfficersMap) {
                fullList.push(await this.mergeDbChainData({
                    address,
                    chainData: chainLegalOfficersMap[address],
                    dbData: dbLegalOfficersMap[address],
                    chainDataProvider: address => Promise.resolve(chainLegalOfficersMap[address]),
                }));
            }
        }

        fullList.sort((lo1, lo2) => lo1.userIdentity.lastName.localeCompare(lo2.userIdentity.lastName));
        return fullList;
    }

    private async mergeDbChainData(args: {
        address: string,
        dbData: LegalOfficerAggregateRoot | null,
        chainData: PalletLoAuthorityListLegalOfficerData,
        chainDataProvider: (address: string) => Promise<PalletLoAuthorityListLegalOfficerData>,
    }): Promise<LegalOfficerDescription> {
        const { address, dbData, chainData, chainDataProvider } = args;
        let description: LegalOfficerDescription;
        if(dbData) {
            description = dbData.getDescription();
        } else {
            description = this.emptyLegalOfficer(address);
        }

        if(chainData) {
            if(chainData.isHost) {
                description = {
                    ...description,
                    node: chainData.asHost.baseUrl.isSome ? chainData.asHost.baseUrl.unwrap().toUtf8() : description.node,
                    nodeId: chainData.asHost.nodeId.isSome ? chainData.asHost.nodeId.unwrap().toString() : description.nodeId,
                }
            } else if(chainData.isGuest) {
                const hostAddress = chainData.asGuest.toHuman();
                const host = await chainDataProvider(hostAddress);
                description = {
                    ...description,
                    node: chainData.asHost.baseUrl.isSome ? host.asHost.baseUrl.unwrap().toUtf8() : description.node,
                    nodeId: chainData.asHost.nodeId.isSome ? host.asHost.nodeId.unwrap().toString() : description.nodeId,
                }
            }
        }

        return description;
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
            nodeId: "",
        };
    }

    async getLegalOfficer(address: string): Promise<LegalOfficerDescription> {
        const api = await this.polkadotService.readyApi();
        const chainLegalOfficer = await api.query.loAuthorityList.legalOfficerSet(address);
        if(chainLegalOfficer.isSome) {
            const dbLegalOfficer = await this.legalOfficerRepository.findByAddress(address);
            return this.mergeDbChainData({
                address,
                chainData: chainLegalOfficer.unwrap(),
                dbData: dbLegalOfficer,
                chainDataProvider: async address => (await api.query.loAuthorityList.legalOfficerSet(address)).unwrap(),
            })
        } else {
            throw new Error("No legal officer with given address");
        }
    }
}
