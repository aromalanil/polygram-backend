import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

// Configuring ENV variables
dotenv.config();

export const googleOAuthClientID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const googleOAuthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
export const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const googleOAuthClient = new OAuth2Client(googleOAuthClientID, googleOAuthClientSecret);
googleOAuthClient.setCredentials({ refresh_token: googleRefreshToken });

const verifyGoogleIdToken = (token) =>
  googleOAuthClient.verifyIdToken({
    idToken: token,
    audience: googleOAuthClientID,
  });

export { verifyGoogleIdToken, googleOAuthClient };
