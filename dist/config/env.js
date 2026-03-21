import 'dotenv/config';
import { cleanEnv, str, port, host } from 'envalid';
export const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ['development', 'test', 'production', 'staging'],
        default: 'development',
    }),
    PORT: port({ default: 3000 }),
    WHATSAPP_PHONE_NUMBER_ID: str({ desc: 'Phone Number ID from Meta Developer Portal' }),
    WHATSAPP_ACCESS_TOKEN: str({ desc: 'Permanent or Temporary Access Token' }),
    WHATSAPP_VERIFY_TOKEN: str({ desc: 'Custom string for webhook verification' }),
    WHATSAPP_API_VERSION: str({ default: 'v20.0' }),
    OPENAI_API_KEY: str({ desc: 'OpenAI API Key' }),
    OPENAI_MODEL: str({ default: 'gpt-4o' }),
    REDIS_HOST: host({ default: 'localhost' }),
    REDIS_PORT: port({ default: 6379 }),
    DATABASE_URL: str({ default: '' }),
});
//# sourceMappingURL=env.js.map