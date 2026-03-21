import 'dotenv/config';
import { cleanEnv, str, port, host, makeValidator } from 'envalid';

// Custom validator to ensure placeholder values are replaced
const nonPlaceholder = makeValidator((val) => {
  if (val.includes('YOUR_') || val.includes('HERE')) {
    throw new Error('is still a placeholder value. Please replace it in your .env file.');
  }
  return val;
});

let validatedEnv;

try {
  validatedEnv = cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production', 'staging'],
      default: 'development',
    }),
    PORT: port({ default: 3000 }),
    
    // WhatsApp Cloud API
    WHATSAPP_PHONE_NUMBER_ID: nonPlaceholder({ desc: 'Phone Number ID from Meta Developer Portal' }),
    WHATSAPP_ACCESS_TOKEN: nonPlaceholder({ desc: 'Permanent or Temporary Access Token' }),
    WHATSAPP_VERIFY_TOKEN: nonPlaceholder({ desc: 'Custom string for webhook verification' }),
    WHATSAPP_API_VERSION: str({ default: 'v20.0' }),

    // OpenAI Configuration
    OPENAI_API_KEY: nonPlaceholder({ desc: 'OpenAI API Key' }),
    OPENAI_MODEL: str({ default: 'gpt-4o' }),

    // Redis Configuration
    REDIS_HOST: host({ default: 'localhost' }),
    REDIS_PORT: port({ default: 6379 }),

    // PostgreSQL Configuration
    DATABASE_URL: str({ desc: 'PostgreSQL Connection URL' }),
  });
} catch (error: any) {
  console.error('\n❌ ENVIRONMENT CONFIGURATION ERROR:');
  console.error(error.message);
  console.error('\nPlease update your .env file with valid credentials before starting the server.\n');
  process.exit(1);
}

export const env = validatedEnv!;
