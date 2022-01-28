import './inversify.decorate';
import { Container } from 'inversify';
import { ApplicationErrorController } from '../controllers/application.error.controller';
import { JsonResponse } from '../middlewares/json.response';
import { LegalOfficerController } from '../controllers/legalofficer.controller';
import { LegalOfficerRepository, LegalOfficerFactory } from "../model/legalofficer.model";
import { AuthenticationService } from "../services/authentication.service";
import { PolkadotService } from "../services/polkadot.service";
import { AuthorityService } from "../services/authority.service";

let container = new Container({ defaultScope: "Singleton" });
container.bind(ApplicationErrorController).toSelf();
container.bind(JsonResponse).toSelf();
container.bind(LegalOfficerController).toSelf();
container.bind(LegalOfficerRepository).toSelf();
container.bind(LegalOfficerFactory).toSelf();
container.bind(AuthenticationService).toSelf();
container.bind(PolkadotService).toSelf();
container.bind(AuthorityService).toSelf();

export { container as AppContainer };
