import { appDataSource, Log } from "@logion/rest-api-core";
import express from 'express';
import expressOasGenerator, { SPEC_OUTPUT_FILE_BEHAVIOR } from 'express-oas-generator';
import { install } from "source-map-support";

import { setupApp, predefinedSpec } from "./app.support.js";

const { logger } = Log;

install();

const app = express();

expressOasGenerator.handleResponses(app, {
    predefinedSpec,
    specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.RECREATE,
    swaggerDocumentOptions: {

    },
    alwaysServeDocs: true,
});

appDataSource.initialize()
    .then(() => {

        setupApp(app)

        expressOasGenerator.handleRequests();

        const port = process.env.PORT || 8090;
        app.listen(port, () => logger.info(`Server started on port ${ port }`));
    });
