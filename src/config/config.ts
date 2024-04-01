import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(5000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGOOSE_STRICT_MODE: Joi.boolean().default(true),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION: Joi.number()
      .default('8h')
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default('30d')
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION: Joi.number()
      .default('30m')
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION: Joi.number()
      .default('30m')
      .description('minutes after which verify email token expires'),
    INFURA_KEY: Joi.string().required().description('Infura key'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    },
    strictQuery: envVars.MONGOOSE_STRICT_MODE,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION,
  },
  infuraKey: envVars.INFURA_KEY,
};

export default config;
