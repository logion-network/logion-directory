import { setupApp } from '../../helpers/testapp';
import request from 'supertest';
import { Container } from "inversify";
import { Mock } from "moq.ts";
import { HealthController } from '../../../src/logion/controllers/health.controller';
import { AuthenticationService } from '../../../src/logion/services/authentication.service';
import { LegalOfficerRepository } from "../../../src/logion/model/legalofficer.model";
import { AuthorityService } from "../../../src/logion/services/authority.service";
import { NodeAuthorizationService } from "../../../src/logion/services/nodeauthorization.service";

describe('HealthController', () => {

    beforeEach(() => {
        process.env.HEALTH_TOKEN = EXPECTED_TOKEN;
    })

    it('OK when authenticated and up', async () => {
        const app = setupApp(HealthController, container => bindMocks(container, true));

        await request(app)
            .get('/api/health')
            .set('Authorization', `Bearer ${EXPECTED_TOKEN}`)
            .expect(200);
    });

    it('Unauthorized with no token', async () => {
        const app = setupApp(HealthController, container => bindMocks(container, true));

        await request(app)
            .get('/api/health')
            .expect(401);
    })

    it('Unauthorized with unexpected token', async () => {
        const app = setupApp(HealthController, container => bindMocks(container, true));

        await request(app)
            .get('/api/health')
            .set('Authorization', `Bearer ${UNEXPECTED_TOKEN}`)
            .expect(401);
    })

    it('Unauthorized with undefined health check token', async () => {
        process.env.HEALTH_TOKEN = undefined;
        const app = setupApp(HealthController, container => bindMocks(container, true));

        await request(app)
            .get('/api/health')
            .set('Authorization', `Bearer ${EXPECTED_TOKEN}`)
            .expect(401);
    })

    it('Internal when authenticated and down', async () => {
        const app = setupApp(HealthController, container => bindMocks(container, false));

        await request(app)
            .get('/api/health')
            .set('Authorization', `Bearer ${EXPECTED_TOKEN}`)
            .expect(500);
    })
});

const EXPECTED_TOKEN = "the-health-check-token";

const UNEXPECTED_TOKEN = "wrong-health-check-token";

function bindMocks(container: Container, up: boolean): void {
    const authorityService = new Mock<AuthorityService>();
    const nodeAuthorizationService = new Mock<NodeAuthorizationService>();

    container.bind(AuthenticationService).toConstantValue(
        new AuthenticationService(authorityService.object(), nodeAuthorizationService.object()));

    const legalOfficerRepository = new Mock<LegalOfficerRepository>();
    if(up) {
        legalOfficerRepository.setup(instance => instance.findAll()).returns(Promise.resolve([]));
    } else {
        legalOfficerRepository.setup(instance => instance.findAll()).throws(new Error("DB is down"));
    }
    container.bind(LegalOfficerRepository).toConstantValue(legalOfficerRepository.object());
}
