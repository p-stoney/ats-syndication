import express from 'express';
import { jsonErrors } from './middleware/jsonErrors';
import { appsRouter } from './modules/applications/router';
import { jobRouter } from './modules/jobs/router';
import { orgRouter } from './modules/organizations/router';
import { platformRouter } from './modules/platforms/router';
import { userRouter } from './modules/users/router';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/apps', appsRouter);
  app.use('/jobs', jobRouter);
  app.use('/organizations', orgRouter);
  app.use('/platforms', platformRouter);
  app.use('/users', userRouter);

  app.use(jsonErrors);

  return app;
}
