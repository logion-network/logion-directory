import { PeerId } from "@logion/node-api/dist/interfaces/default";
import { injectable } from "inversify";
import { createFromB58String } from "peer-id";

import { PolkadotService } from "./polkadot.service";

@injectable()
export class NodeAuthorizationService {

    constructor(
        private polkadotService: PolkadotService
    ) {
    }

    async isWellKnownNode(base58PeerId: string): Promise<boolean> {
        const hexPeerId = createFromB58String(base58PeerId).toHexString();
        const api = await this.polkadotService.readyApi();
        const wellKnowNodes: Set<PeerId> = await api.query.nodeAuthorization.wellKnownNodes();
        for (let wellKnowNode of wellKnowNodes) {
            if (wellKnowNode.toHex() === `0x${ hexPeerId }`) {
                return true
            }
        }
        return false;
    }
}
