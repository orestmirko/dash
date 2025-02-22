export interface CONFIG_TYPES {
  APP: {
    PORT: number;
    HOST: string;
    CORS_ALLOWED_ORIGINS: string[];
    FRONTEND_URL: string;
  };
  DATABASE: {
    TYPE: string;
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    DATABASE: string;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    MIGRATIONS_RUN: boolean;
    ENTITIES: string[];
    MIGRATIONS: string[];
    MIGRATIONS_DIR: string;
  };
  JWT: {
    ACCESS_SECRET: string;
    REFRESH_SECRET: string;
    ACCESS_EXPIRATION: string;
    REFRESH_EXPIRATION: string;
  };
  REDIS: {
    HOST: string;
    PORT: number;
    TTL: number;
  };
  SENDPULSE: {
    USER_ID: string;
    SECRET: string;
    SENDER_NAME: string;
    SENDER_EMAIL: string;
  };
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: number;
    BLOCK_DURATION_SECONDS: number;
  };
}
