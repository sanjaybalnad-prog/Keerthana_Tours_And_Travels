import { env } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'admin_token';

// The same options must be used when setting and clearing the cookie,
// otherwise the browser will not remove it.
const baseOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  path: '/',
};

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...baseOptions,
    maxAge: env.jwtExpiresInHours * 60 * 60 * 1000, // matches the JWT lifetime
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, baseOptions);
};
