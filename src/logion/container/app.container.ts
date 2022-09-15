import { configureContainer } from '@logion/rest-api-core';
import { Container } from 'inversify';

import { LegalOfficerController } from '../controllers/legalofficer.controller';
import { LegalOfficerRepository, LegalOfficerFactory } from "../model/legalofficer.model";
import { HealthController } from "../controllers/health.controller";
import { LegalOfficerDataMergeService } from '../services/legalofficerdatamerge.service';

let container = new Container({ defaultScope: "Singleton" });
configureContainer(container);

container.bind(LegalOfficerRepository).toSelf();
container.bind(LegalOfficerFactory).toSelf();
container.bind(LegalOfficerDataMergeService).toSelf();

// Controllers are stateful so they must not be injected with singleton scope
container.bind(LegalOfficerController).toSelf().inTransientScope();
container.bind(HealthController).toSelf().inTransientScope();

export { container as AppContainer };
