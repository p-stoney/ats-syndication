import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  UserPool,
  UserPoolClient,
  UserPoolDomain,
  OAuthScope,
} from 'aws-cdk-lib/aws-cognito';

interface CognitoStackProps extends StackProps {
  isProd?: boolean;
}

export class CognitoStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: CognitoStackProps) {
    super(scope, id, props);

    const { isProd } = props || {};

    this.userPool = new UserPool(this, 'MyATSUserPool', {
      userPoolName: 'MyATSUserPool',
      selfSignUpEnabled: !isProd,
      signInAliases: {
        username: true,
        email: true,
      },
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    const domain = new UserPoolDomain(this, 'MyUserPoolDomain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: 'my-ats-domain',
      },
    });

    this.userPoolClient = this.userPool.addClient('MyATSAppClient', {
      userPoolClientName: 'MyATSAppClient',
      generateSecret: false,
      authFlows: {
        userSrp: true,
      },
      oAuth: {
        callbackUrls: isProd
          ? ['https://myprodsite.com/callback']
          : ['http://localhost:3000/callback'],
        logoutUrls: isProd
          ? ['https://myprodsite.com/logout']
          : ['http://localhost:3000/logout'],
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
      },
    });
  }
}
