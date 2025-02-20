import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  AWS_REGION: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) throw new Error('Invalid environment variables');

export const env = parsed.data;
