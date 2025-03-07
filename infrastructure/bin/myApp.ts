import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/CognitoStack';
import { InfrastructureStack } from '../lib/InfrastructureStack';

const isProd = process.env.NODE_ENV === 'production';

const app = new cdk.App();

const cognitoStack = new CognitoStack(app, 'CognitoStack', {
  isProd,
});

new InfrastructureStack(app, 'SyndicatedStack', {
  userPool: cognitoStack.userPool,
  userPoolClient: cognitoStack.userPoolClient,
  isProd,
});
