import serverless from 'serverless-http';
import { createApp } from './app';

const app = createApp();

export const handler = serverless(app);

if (require.main === module) {
  app.listen(3000, () => console.log('Listening on 3000...'));
}
