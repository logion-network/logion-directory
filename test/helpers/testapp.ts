import '../../src/logion/container/inversify.decorate';
import express, { Express } from "express";
import { Container } from "inversify";
import bodyParser from "body-parser";
import { Dino } from "dinoloop";
import { JsonResponse } from "../../src/logion/middlewares/json.response";
import { ApplicationErrorController } from "../../src/logion/controllers/application.error.controller";

export function setupApp<T>(
    controller: Function & { prototype: T; },
    mockBinder: (container: Container) => void,
): Express {

    const app = express();
    app.use(bodyParser.json());

    const dino = new Dino(app, '/api');

    dino.useRouter(() => express.Router());
    dino.registerController(controller);
    dino.registerApplicationError(ApplicationErrorController);
    dino.requestEnd(JsonResponse);

    let container = new Container({ defaultScope: "Singleton" });

    mockBinder(container);

    dino.dependencyResolver<Container>(container,
        (injector, type) => {
            return injector.resolve(type);
        });

    dino.bind();

    return app;
}
