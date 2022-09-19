import { configureContainer, HealthService } from '@logion/rest-api-core';
import { Container } from 'inversify';

import { LegalOfficerController } from '../controllers/legalofficer.controller';
import { LegalOfficerRepository, LegalOfficerFactory } from "../model/legalofficer.model";
import { DirectoryHealthService } from '../services/health.service';
import { LegalOfficerDataMergeService } from '../services/legalofficerdatamerge.service';

let container = new Container({ defaultScope: "Singleton", skipBaseClassChecks: true });
configureContainer(container);

container.bind(LegalOfficerRepository).toSelf();
container.bind(LegalOfficerFactory).toSelf();
container.bind(LegalOfficerDataMergeService).toSelf();
container.bind(DirectoryHealthService).toSelf();
container.bind(HealthService).toService(DirectoryHealthService);

// Controllers are stateful so they must not be injected with singleton scope
container.bind(LegalOfficerController).toSelf().inTransientScope();

export { container as AppContainer };
