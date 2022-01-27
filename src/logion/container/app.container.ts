import './inversify.decorate';
import { Container } from 'inversify';
import { ApplicationErrorController } from '../controllers/application.error.controller';
import { JsonResponse } from '../middlewares/json.response';
import { LegalOfficerController } from '../controllers/legalofficer.controller';
import { LegalOfficerRepository } from "../model/legalofficer.model";

let container = new Container({ defaultScope: "Singleton" });
container.bind(ApplicationErrorController).toSelf();
container.bind(JsonResponse).toSelf();
container.bind(LegalOfficerController).toSelf();
container.bind(LegalOfficerRepository).toSelf();

export { container as AppContainer };
