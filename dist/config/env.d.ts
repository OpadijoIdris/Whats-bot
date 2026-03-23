import 'dotenv/config';
export declare const env: Readonly<{
    NODE_ENV: "development" | "test" | "production" | "staging";
    PORT: number;
    WHATSAPP_PHONE_NUMBER_ID: string;
    WHATSAPP_ACCESS_TOKEN: string;
    WHATSAPP_VERIFY_TOKEN: string;
    WHATSAPP_API_VERSION: string;
    WHATSAPP_APP_SECRET: string;
    OPENAI_API_KEY: string;
    OPENAI_MODEL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    DATABASE_URL: string;
} & import("envalid").CleanedEnvAccessors> | {
    NODE_ENV: string;
    PORT: number;
    WHATSAPP_PHONE_NUMBER_ID: string;
    WHATSAPP_ACCESS_TOKEN: string;
    WHATSAPP_VERIFY_TOKEN: string;
    WHATSAPP_API_VERSION: string;
    WHATSAPP_APP_SECRET: string;
    OPENAI_API_KEY: string;
    OPENAI_MODEL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    DATABASE_URL: string;
};
//# sourceMappingURL=env.d.ts.map