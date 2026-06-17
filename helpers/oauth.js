import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

// Configuring ENV variables
dotenv.config();

export const googleOAuthClientID = process.env.GOOGLE_OAUTH_CLIENT_ID;

// Client secret is not needed as we are just verifying the token, not exchanging it for an access token
export const googleOAuthClient = new OAuth2Client(googleOAuthClientID);

export const verifyGoogleIdToken = (token) =>
  googleOAuthClient.verifyIdToken({
    idToken: token,
    audience: googleOAuthClientID,
  });
