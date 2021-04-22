/**
 *
 * Generates HTML Template for sending OTP
 * @param {String|Number} otp OTP to be send
 * @param {String} name Name of the user
 * @returns HTML template for sending OTP
 */
export const generateOtpHTMLTemplate = (otp, name) => `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Poly</a>
    </div>
    <p style="font-size:1.1em">Hi, ${name}</p>
    <p>Thank you for choosing Poly. Use the following OTP to proceed further. OTP is valid for 10 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Team Poly</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Poly</p>
      <p>Final Year Project</p>
      <p>College of Engineering Cherthala</p>
    </div>
  </div>
</div>
`;

/**
 *
 * Generates Text Template for sending OTP
 * @param {String|Number} otp OTP to be send
 * @param {String} name Name of the user
 * @returns Text template for sending OTP
 */
export const generateOtpTextTemplate = (otp, name) =>
  `Hi ${name},

  Thank you for choosing Poly. 
  
  Here is your one time password : ${otp}

  Use the following OTP to proceed further. OTP is valid for 10 minutes.

  Thanks,
  Team Poly
`;
