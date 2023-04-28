import { LogionNodeApiClass } from "@logion/node-api";
import { PolkadotService } from "@logion/rest-api-core";
import { PalletLoAuthorityListLegalOfficerData, PalletLoAuthorityListHostData } from "@polkadot/types/lookup";
import type { ApiPromise } from '@polkadot/api';
import type { StorageKey, Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';
import { Mock } from 'moq.ts';

import { LegalOfficerAggregateRoot, LegalOfficerDescription, LegalOfficerRepository } from '../../../src/logion/model/legalofficer.model.js';
import { LegalOfficerDataMergeService } from '../../../src/logion/services/legalofficerdatamerge.service.js';
import { LEGAL_OFFICERS } from '../../../test/testdata.js';

describe("LegalOfficerDataMergeService", () => {

    it("merges data from chain and DB", async () => {
        givenChainLegalOfficers(FULL_CHAIN_SET);
        givenDbLegalOfficers(FULL_DB_SET);
        await whenGettingAll();
        thenResultMatches(FULL_DESCRIPTION_SET);
    })

    it("merges incomplete data from chain and DB", async () => {
        givenChainLegalOfficers(FULL_CHAIN_SET);
        givenDbLegalOfficers(PARTIAL_DB_SET);
        await whenGettingAll();
        thenResultMatches(PARTIAL_DESCRIPTION_SET);
    })

    it("merges data from chain and DB with base URL set on-chain", async () => {
        givenChainLegalOfficers(FULL_CHAIN_SET_WITH_BASE_URL);
        givenDbLegalOfficers(FULL_DB_SET);
        await whenGettingAll();
        thenResultMatches(FULL_DESCRIPTION_SET_WITH_BASE_URL);
    })
})

type LegalOfficersSet = [StorageKey<[AccountId]>, Option<PalletLoAuthorityListLegalOfficerData>][];

function givenChainLegalOfficers(set: LegalOfficersSet) {
    polkadotService = new Mock<PolkadotService>();
    const api = {
        query: {
            loAuthorityList: {
                legalOfficerSet: {
                    entries: () => Promise.resolve(set)
                }
            }
        }
    };
    polkadotService.setup(instance => instance.readyApi()).returns(Promise.resolve(new LogionNodeApiClass(api as ApiPromise)));
}

let polkadotService: Mock<PolkadotService>;

const FULL_DESCRIPTION_SET: LegalOfficerDescription[] = LEGAL_OFFICERS;

const FULL_CHAIN_SET: LegalOfficersSet = FULL_DESCRIPTION_SET.map(mockHostChainEntryWithoutBaseUrl);

const FULL_CHAIN_SET_WITH_BASE_URL: LegalOfficersSet = FULL_DESCRIPTION_SET.map(mockHostChainEntryWithBaseUrl);

const FULL_DESCRIPTION_SET_WITH_BASE_URL: LegalOfficerDescription[] = LEGAL_OFFICERS.map(description => ({
    ...description,
    node: description.node.replace("localhost", "logion.network"),
}));

function mockHostChainEntryWithoutBaseUrl(description: LegalOfficerDescription): [StorageKey<[AccountId]>, Option<PalletLoAuthorityListLegalOfficerData>] {
    return mockHostChainEntry(description, false);
}

function mockHostChainEntry(description: LegalOfficerDescription, withBaseUrl: boolean): [StorageKey<[AccountId]>, Option<PalletLoAuthorityListLegalOfficerData>] {
    return [
        {
            toHuman: () => [ description.address ]
        } as StorageKey<[AccountId]>,
        {
            isSome: true,
            unwrap: () => ({
                isHost: true,
                asHost: {
                    baseUrl: { isSome: withBaseUrl, unwrap: () => ({ toUtf8: () => description.node.replace("localhost", "logion.network") }) },
                    nodeId: { isSome: false, unwrap: () => { throw new Error() } },
                } as unknown as PalletLoAuthorityListHostData,
            })
        } as Option<PalletLoAuthorityListLegalOfficerData>
    ];
}

function mockHostChainEntryWithBaseUrl(description: LegalOfficerDescription): [StorageKey<[AccountId]>, Option<PalletLoAuthorityListLegalOfficerData>] {
    return mockHostChainEntry(description, true);
}

function givenDbLegalOfficers(set: LegalOfficerAggregateRoot[]) {
    legalOfficerRepository = new Mock<LegalOfficerRepository>();
    legalOfficerRepository.setup(instance => instance.findAll()).returns(Promise.resolve(set));
}

let legalOfficerRepository: Mock<LegalOfficerRepository>;

const FULL_DB_SET: LegalOfficerAggregateRoot[] = FULL_DESCRIPTION_SET.map(mockAggregate);

function mockAggregate(description: LegalOfficerDescription): LegalOfficerAggregateRoot {
    const root = new Mock<LegalOfficerAggregateRoot>();
    root.setup(instance => instance.address).returns(description.address);
    root.setup(instance => instance.getDescription()).returns(description);
    return root.object();
}

async function whenGettingAll() {
    const merger = new LegalOfficerDataMergeService(legalOfficerRepository.object(), polkadotService.object());
    result = await merger.getAllLegalOfficers();
}

let result: LegalOfficerDescription[];

function thenResultMatches(set: LegalOfficerDescription[]) {
    expect(result.length).toBe(set.length);
    set.forEach(description => expect(result.find(other => other.address === description.address)).toEqual(description));
}

const PARTIAL_DESCRIPTION_SET: LegalOfficerDescription[] = LEGAL_OFFICERS.slice(1);
const PARTIAL_DB_SET: LegalOfficerAggregateRoot[] = LEGAL_OFFICERS.slice(1).map(mockAggregate);
