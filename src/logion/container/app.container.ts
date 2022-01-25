import './inversify.decorate';
import { Container } from 'inversify';
import { ApplicationErrorController } from '../controllers/application.error.controller';
import { JsonResponse } from '../middlewares/json.response';
import { LegalOfficerController } from '../controllers/legalofficer.controller';

let container = new Container({ defaultScope: "Singleton" });
container.bind(ApplicationErrorController).toSelf();
container.bind(JsonResponse).toSelf();
container.bind(LegalOfficerController).toSelf();

export { container as AppContainer };
