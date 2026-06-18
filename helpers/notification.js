import dotenv from 'dotenv';
import webPush from 'web-push';
import User from '../models/user.js';

// Configuring ENV variables
dotenv.config();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

webPush.setVapidDetails('mailto:polygramapp@gmail.com', vapidPublicKey, vapidPrivateKey);

export const sendPushNotification = async (subscription, title, body) => {
  if (!subscription) return Promise.resolve();
  const payload = JSON.stringify({ body, title });

  try {
    return await webPush.sendNotification(JSON.parse(subscription), payload);
  } catch (err) {
    console.error('Error sending push notification:', err); // eslint-disable-line no-console

    // If the push subscription is expired or invalid, remove it from the database
    if (err.statusCode === 410 || err.statusCode === 404) {
      try {
        await User.updateOne(
          { push_subscription: subscription },
          { $set: { push_subscription: null } }
        );
        console.log('Cleaned up stale push subscription from database'); // eslint-disable-line no-console
      } catch (dbErr) {
        console.error('Error cleaning up stale subscription from database:', dbErr); // eslint-disable-line no-console
      }
    }
  }
};
