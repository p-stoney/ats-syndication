import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import {
  LambdaRestApi,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
import { IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';

interface InfrastructureStackProps extends cdk.StackProps {
  userPool?: IUserPool;
  userPoolClient?: IUserPoolClient;
  isProd?: boolean;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfrastructureStackProps) {
    super(scope, id, props);

    const { userPool, userPoolClient, isProd } = props || {};

    const myLambda = new Function(this, 'MyBackendLambda', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, '../../..', 'backend/dist')),
      handler: 'index.handler',
    });

    const api = new LambdaRestApi(this, 'MyApiGateway', {
      handler: myLambda,
      restApiName: 'SyndicatedATSApi',
    });

    if (userPool) {
      const authorizer = new CognitoUserPoolsAuthorizer(
        this,
        'MyATSAuthorizer',
        {
          cognitoUserPools: [userPool],
        }
      );

      api.root.addMethod('ANY', undefined, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer,
      });
    }
  }
}
