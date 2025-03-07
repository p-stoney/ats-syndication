import axios from 'axios';
import { db } from '@backend/db';

export interface IndeedIntegrationConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class IndeedIntegration {
  private config: IndeedIntegrationConfig;

  constructor(config: IndeedIntegrationConfig) {
    this.config = config;
  }

  async exchangeCodeForToken(
    userId: string,
    authCode: string,
    codeVerifier?: string
  ) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', this.config.clientId);
    formData.append('client_secret', this.config.clientSecret);
    formData.append('code', authCode);
    formData.append('redirect_uri', this.config.redirectUri);

    if (codeVerifier) {
      formData.append('code_verifier', codeVerifier);
    }

    try {
      const response = await axios.post<{
        access_token: string;
        refresh_token?: string;
        expires_in: number;
      }>('https://apis.indeed.com/oauth/v2/tokens', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;

      await db.userExternalAuth.upsert({
        where: {
          userId_platform: {
            userId,
            platform: 'INDEED',
          },
        },
        create: {
          userId,
          platform: 'INDEED',
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: new Date(Date.now() + expires_in * 1000),
        },
        update: {
          accessToken: access_token,
          refreshToken: refresh_token ?? undefined,
          expiresAt: new Date(Date.now() + expires_in * 1000),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(userId: string) {
    const record = await db.userExternalAuth.findUnique({
      where: {
        userId_platform: { userId, platform: 'INDEED' },
      },
    });

    if (!record?.refreshToken) {
      throw new Error(`No refresh token found for user ${userId}`);
    }

    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('client_id', this.config.clientId);
    formData.append('client_secret', this.config.clientSecret);
    formData.append('refresh_token', record.refreshToken);

    try {
      const response = await axios.post<{
        access_token: string;
        refresh_token?: string;
        expires_in: number;
      }>('https://apis.indeed.com/oauth/v2/tokens', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;

      await db.userExternalAuth.update({
        where: { userId_platform: { userId, platform: 'INDEED' } },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token ?? record.refreshToken,
          expiresAt: new Date(Date.now() + expires_in * 1000),
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async postJobForUser(
    userId: string,
    jobData: { title: string; description: string; location?: string }
  ) {
    let record = await db.userExternalAuth.findUnique({
      where: { userId_platform: { userId, platform: 'INDEED' } },
    });

    if (!record?.accessToken) {
      throw new Error(`No Indeed tokens found for user ${userId}`);
    }

    if (record.expiresAt && record.expiresAt < new Date()) {
      const newTokens = await this.refreshToken(userId);
      record = {
        ...record,
        accessToken: newTokens.access_token,
      };
    }

    try {
      const response = await axios.post(
        'https://apis.indeed.com/v2/jobs',
        jobData,
        {
          headers: {
            Authorization: `Bearer ${record.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
