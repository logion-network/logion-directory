import { injectable } from 'inversify';
import { ApiPromise } from '@polkadot/api';
import { Log } from "../util/Log";
import { buildApi } from "logion-api/dist/Connection";

const { logger } = Log;

@injectable()
export class PolkadotService {

    async readyApi(): Promise<ApiPromise> {
        if (this._api === null) {
            this._api = await buildApi(process.env.WS_PROVIDER_URL || 'ws://localhost:9944');
        }
        return this._api;
    }

    private _api: ApiPromise | null = null;
}
