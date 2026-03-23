import 'dotenv/config';
import { cleanEnv, str, port, host, makeValidator } from 'envalid';
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
        WHATSAPP_PHONE_NUMBER_ID: nonPlaceholder({ desc: 'Phone Number ID from Meta Developer Portal' }),
        WHATSAPP_ACCESS_TOKEN: nonPlaceholder({ desc: 'Permanent or Temporary Access Token' }),
        WHATSAPP_VERIFY_TOKEN: nonPlaceholder({ desc: 'Custom string for webhook verification' }),
        WHATSAPP_API_VERSION: str({ default: 'v20.0' }),
        WHATSAPP_APP_SECRET: nonPlaceholder({ desc: 'App Secret from Meta Developer Portal' }),
        OPENAI_API_KEY: nonPlaceholder({ desc: 'OpenAI API Key' }),
        OPENAI_MODEL: str({ default: 'gpt-4o' }),
        REDIS_HOST: host({ default: 'localhost' }),
        REDIS_PORT: port({ default: 6379 }),
        DATABASE_URL: str({ desc: 'PostgreSQL Connection URL' }),
    });
}
catch (error) {
    if (process.env['NODE_ENV'] === 'test') {
        validatedEnv = {
            NODE_ENV: 'test',
            PORT: 3000,
            WHATSAPP_PHONE_NUMBER_ID: 'test_id',
            WHATSAPP_ACCESS_TOKEN: 'test_token',
            WHATSAPP_VERIFY_TOKEN: 'test_verify',
            WHATSAPP_API_VERSION: 'v20.0',
            WHATSAPP_APP_SECRET: 'test_secret',
            OPENAI_API_KEY: 'test_openai_key',
            OPENAI_MODEL: 'gpt-4o',
            REDIS_HOST: 'localhost',
            REDIS_PORT: 6379,
            DATABASE_URL: 'postgresql://localhost:5432/test',
        };
    }
    else {
        console.error('\n❌ ENVIRONMENT CONFIGURATION ERROR:');
        console.error(error.message);
        console.error('\nPlease update your .env file with valid credentials before starting the server.\n');
        process.exit(1);
    }
}
export const env = validatedEnv;
//# sourceMappingURL=env.js.map