import { OpenAPIV3 } from "openapi-types";
import { setOpenApi3, loadSchemasIntoSpec } from "./controllers/doc";
import { LegalOfficerController, fillInSpec as fillInSpecForLegalOfficer } from "./controllers/legalofficer.controller";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Dino } from "dinoloop";
import { ApplicationErrorController } from "./controllers/application.error.controller";
import { JsonResponse } from "./middlewares/json.response";
import { Container } from "inversify";
import { AppContainer } from "./container/app.container";
import { HealthController } from "./controllers/health.controller";
import { AuthenticationController } from "./controllers/authentication.controller";

export function predefinedSpec(spec: OpenAPIV3.Document): OpenAPIV3.Document {
    setOpenApi3(spec);
    loadSchemasIntoSpec(spec, "./resources/schemas.json");

    spec.info = {
        title: "Logion off-chain service API",
        description: `API for legal officers directory.  
[Spec V3](/api-spec/v3)`,
        termsOfService: "https://logion.network/",
        contact: {
            name: "Logion Team",
            url: "https://logion.network/",
            email: "info@logion.network"
        },
        license: {
            name: "Apache 2.0",
            url: "http://www.apache.org/licenses/LICENSE-2.0"
        },
        version: "0.1",
    };

    fillInSpecForLegalOfficer(spec);

    return spec;
}

export function setupApp(app: Express) {
    app.use(bodyParser.json());
    app.use(cors());

    const dino = new Dino(app, '/api');

    dino.useRouter(() => express.Router());
    dino.registerController(LegalOfficerController);
    dino.registerController(HealthController);
    dino.registerController(AuthenticationController);
    dino.registerApplicationError(ApplicationErrorController);
    dino.requestEnd(JsonResponse);

    dino.dependencyResolver<Container>(AppContainer,
        (injector, type) => {
            return injector.resolve(type);
        });

    dino.bind();
}
