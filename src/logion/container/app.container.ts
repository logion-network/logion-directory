import './inversify.decorate';
import { Container } from 'inversify';
import { ApplicationErrorController } from '../controllers/application.error.controller';
import { JsonResponse } from '../middlewares/json.response';
import { LegalOfficerController } from '../controllers/legalofficer.controller';
import { LegalOfficerRepository, LegalOfficerFactory } from "../model/legalofficer.model";
import { AuthenticationService } from "../services/authentication.service";
import { PolkadotService } from "../services/polkadot.service";
import { AuthorityService } from "../services/authority.service";
import { HealthController } from "../controllers/health.controller";
import { LegalOfficerDataMergeService } from '../services/legalofficerdatamerge.service';
import { SessionFactory, SessionRepository } from '../model/session.model';
import { SignatureService } from '../services/signature.service';
import { NodeAuthorizationService } from "../services/nodeauthorization.service";

let container = new Container({ defaultScope: "Singleton" });

container.bind(JsonResponse).toSelf();
container.bind(LegalOfficerRepository).toSelf();
container.bind(LegalOfficerFactory).toSelf();
container.bind(AuthenticationService).toSelf();
container.bind(PolkadotService).toSelf();
container.bind(AuthorityService).toSelf();
container.bind(LegalOfficerDataMergeService).toSelf();
container.bind(SessionFactory).toSelf();
container.bind(SessionRepository).toSelf();
container.bind(SignatureService).toSelf();
container.bind(NodeAuthorizationService).toSelf();

// Controllers are stateful so they must not be injected with singleton scope
container.bind(ApplicationErrorController).toSelf().inTransientScope();
container.bind(LegalOfficerController).toSelf().inTransientScope();
container.bind(HealthController).toSelf().inTransientScope();

export { container as AppContainer };
