import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      jwt: {
        expiresIn: env('JWT_EXPIRES_IN', '7d'),
      },
      refreshToken: {
        expiresIn: env.int('JWT_REFRESH_EXPIRES_IN', 30 * 24 * 60 * 60),
      },
    },
  },
});

export default config;
