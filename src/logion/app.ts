// tslint:disable-next-line: no-require-imports no-var-requires
import express, { Express } from 'express';
import expressOasGenerator, { SPEC_OUTPUT_FILE_BEHAVIOR } from 'express-oas-generator';
import { Log } from "./util/Log";
import { setupApp, predefinedSpec } from "./app.support";
import { createConnection } from "typeorm";

const { logger } = Log;

require('source-map-support').install();

const app:Express = express();

expressOasGenerator.handleResponses(app, {
    predefinedSpec,
    specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.RECREATE,
    swaggerDocumentOptions: {

    },
    alwaysServeDocs: true,
});

createConnection()
    .then(_ => {

        setupApp(app)

        expressOasGenerator.handleRequests();

        const port = process.env.PORT || 8090;
        app.listen(port, () => logger.info(`Server started on port ${ port }`));
    });
