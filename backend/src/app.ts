import express from 'express';
import { jsonErrors } from './middleware/jsonErrors';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(jsonErrors);

  return app;
}
