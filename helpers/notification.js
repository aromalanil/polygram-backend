import dotenv from 'dotenv';
import webPush from 'web-push';

// Configuring ENV variables
dotenv.config();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

webPush.setVapidDetails('mailto:polygramapp@gmail.com', vapidPublicKey, vapidPrivateKey);

export const sendPushNotification = (subscription, title, body) => {
  if (!subscription) return;
  const payload = JSON.stringify({ body, title });
  webPush.sendNotification(JSON.parse(subscription), payload);
};
