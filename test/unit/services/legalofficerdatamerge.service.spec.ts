import { Mock } from 'moq.ts';
import type { ApiPromise } from '@polkadot/api';
import type { StorageKey, Option, bool } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

import { PolkadotService } from '../../../src/logion/services/polkadot.service';
import { LegalOfficerAggregateRoot, LegalOfficerDescription, LegalOfficerRepository } from '../../../src/logion/model/legalofficer.model';
import { LegalOfficerDataMergeService } from '../../../src/logion/services/legalofficerdatamerge.service';
import { LEGAL_OFFICERS } from '../../../test/testdata';

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
})

type LegalOfficersSet = [StorageKey<[AccountId]>, Option<bool>][];

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
    polkadotService.setup(instance => instance.readyApi()).returns(Promise.resolve(api as ApiPromise));
}

let polkadotService: Mock<PolkadotService>;

const FULL_DESCRIPTION_SET: LegalOfficerDescription[] = LEGAL_OFFICERS;

const FULL_CHAIN_SET: LegalOfficersSet = FULL_DESCRIPTION_SET.map(mockChainEntry);

function mockChainEntry(description: LegalOfficerDescription): [StorageKey<[AccountId]>, Option<bool>] {
    return [
        {
            toHuman: () => [ description.address ]
        } as StorageKey<[AccountId]>,
        {
            isSome: true,
            unwrap: () => ({ isTrue: true })
        } as Option<bool>
    ];
}

function givenDbLegalOfficers(set: LegalOfficerAggregateRoot[]) {
    legalOfficerRepository = new Mock<LegalOfficerRepository>();
    legalOfficerRepository.setup(instance => instance.findAll()).returns(Promise.resolve(set));
}

let legalOfficerRepository: Mock<LegalOfficerRepository>;

const FULL_DB_SET: LegalOfficerAggregateRoot[] = FULL_DESCRIPTION_SET.map(mockAggregate);

function mockAggregate(description: LegalOfficerDescription): LegalOfficerAggregateRoot {
    const root = new Mock<LegalOfficerAggregateRoot>();
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
PARTIAL_DESCRIPTION_SET.push({
    address: LEGAL_OFFICERS[0].address,
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
});

const PARTIAL_DB_SET: LegalOfficerAggregateRoot[] = LEGAL_OFFICERS.slice(1).map(mockAggregate);
