/**
 *
 * Generates HTML Template for sending OTP
 * @param {String|Number} otp OTP to be send
 * @param {String} name Name of the user
 * @returns HTML template for sending OTP
 */
export const generateOtpHTMLTemplate = (otp, name) => {
  const refId = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polygram Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    body, table, td, p, a, span, div {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f9fafb; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; width: 100%; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <tr>
            <td style="height: 4px; background-color: #7d71fe; border-top-left-radius: 8px; border-top-right-radius: 8px;"></td>
          </tr>
          <tr>
            <td align="center" style="padding: 48px 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 40px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align: middle;">
                          <img src="https://polygram.aromalanil.in/assets/logo-small.png" width="32" height="32" alt="Polygram" style="display: block; width: 32px; height: 32px; border: 0;">
                        </td>
                        <td style="padding-left: 10px; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.5px; vertical-align: middle;">
                          Polygram
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="font-size: 15px; line-height: 24px; color: #4b5563; padding-bottom: 32px;">
                    <p style="margin: 0 0 12px 0;">Hi ${name},</p>
                    <p style="margin: 0;">
                      Use the following one-time password to sign in to your Polygram account. This code is valid for <b>10 minutes</b>.
                    </p>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 40px;">
                    <div style="font-size: 48px; font-weight: 700; color: #111827; letter-spacing: 8px;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="height: 1px; background-color: #f3f4f6; width: 100%;"></div>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="font-size: 12px; line-height: 18px; color: #9ca3af;">
                    <p style="margin: 0 0 12px 0;">If you didn't request this, you can safely ignore it.</p>
                    <p style="margin: 0;">&copy; 2026 Polygram. All rights reserved.</p>
                    <span style="display: none !important; font-size: 0; line-height: 0; max-height: 0; mso-hide: all; opacity: 0; overflow: hidden; visibility: hidden;">${refId}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

/**
 *
 * Generates Text Template for sending OTP
 * @param {String|Number} otp OTP to be send
 * @param {String} name Name of the user
 * @returns Text template for sending OTP
 */
export const generateOtpTextTemplate = (otp, name) =>
  `Hi ${name},

Use the following one-time password to sign in to your Polygram account:

${otp}

This code is valid for 10 minutes.

If you didn't request this, you can safely ignore it.

Copyright © 2026 Polygram. All rights reserved.
`;
