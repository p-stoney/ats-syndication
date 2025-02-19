import serverless from 'serverless-http';
import { app } from './app';

export const handler = serverless(app);

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Listening locally on port 3000...');
  });
}
