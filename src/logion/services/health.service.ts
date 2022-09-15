import { injectable } from "inversify";
import { HealthService } from "@logion/rest-api-core";

import { LegalOfficerRepository } from "../model/legalofficer.model";

@injectable()
export class DirectoryHealthService extends HealthService {

    constructor(
        private legalOfficerRepository: LegalOfficerRepository,
    ) {
        super();
    }

    async checkHealth(): Promise<void> {
        await this.legalOfficerRepository.findAll();
    }
}
