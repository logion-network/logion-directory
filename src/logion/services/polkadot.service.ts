import "@logion/node-api/dist/interfaces/types-lookup";
import { injectable } from 'inversify';
import { ApiPromise } from '@polkadot/api';
import { buildApi } from "@logion/node-api";

@injectable()
export class PolkadotService {

    async readyApi(): Promise<ApiPromise> {
        const urls = process.env.WS_PROVIDER_URL || 'ws://localhost:9944';
        const urlsArray = urls.split(",");
        if (this._api === null) {
            this._api = await buildApi(urlsArray);
        }
        return this._api;
    }

    private _api: ApiPromise | null = null;
}
