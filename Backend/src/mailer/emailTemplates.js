export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; color: #333;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #4CAF50, #2E7D32); padding: 25px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Verify Your Email</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="font-size: 16px; margin: 0 0 10px;">Hello Sir, &#x1F44B;</p>
              <p style="font-size: 15px; line-height: 1.7; margin-bottom: 25px;">
                Thank you for joining <strong>Your App</strong>! To secure your account, please use the verification code below to verify your email address.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: #fff; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 8px;">
                  {verificationCode}
                </div>
              </div>

              <p style="font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
                Enter this code on the verification page to complete your registration. 
              </p>
              <p style="font-size: 14px; color: #555;">
                &#x26A0; This code will expire in <strong>15 minutes</strong> for security reasons.
              </p>

              <p style="margin-top: 35px; font-size: 15px;">
                Warm regards,<br>
                <strong>BlogApp Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f4f4f4; padding: 15px 20px; color: #888; font-size: 13px;">
              <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0;">&copy; BlogApp Team. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to BlogApp</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #6a11cb, #2575fc); padding: 35px 20px;">
              <h1 style="color: #ffffff; font-size: 30px; margin: 0; font-weight: 600;">Welcome to <span style="color: #ffeb3b;">BlogApp</span></h1>
              <p style="color: #e0e0e0; font-size: 16px; margin-top: 10px;">Your creative journey starts here</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 35px 40px;">
              <p style="font-size: 16px; margin: 0 0 10px;">Hi <strong>{username}</strong>, &#x1F44B;</p>
              <p style="font-size: 15px; line-height: 1.8; margin-bottom: 25px;">
                Welcome to <strong>BlogApp</strong> — your new home for sharing stories, ideas, and inspiration.  
                We're so glad you’ve joined our community of passionate creators and readers!
              </p>

              <div style="text-align: center; margin: 40px 0;">
                <div style="display: inline-block; width: 100px; height: 100px; background: radial-gradient(circle at top left, #2575fc, #6a11cb); border-radius: 50%; color: #fff; font-size: 48px; line-height: 100px;">
                  &#x1F38A;
                </div>
              </div>

              <p style="font-size: 15px; line-height: 1.8;">
                Explore new blogs, connect with creators, and share your thoughts freely.  
                If you ever need help, our support team is just a message away.
              </p>

            

              <p style="margin-top: 30px; font-size: 15px;">
                Warm regards,<br>
                <strong>BlogApp Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9f9f9; padding: 20px 10px; color: #777; font-size: 13px;">
              <p style="margin: 0;">This is an automated email, please do not reply.</p>
              <p style="margin: 5px 0 0;">&copy; BlogApp Team. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;


export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #ff416c, #ff4b2b); padding: 35px 20px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Password Reset Requested</h1>
              <p style="color: #f8f8f8; margin-top: 8px; font-size: 15px;">We’ve received a request to reset your BlogApp password</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 35px 40px;">
              <p style="font-size: 16px; margin: 0 0 10px;">Hello, 👋🏻</p>
              <p style="font-size: 15px; line-height: 1.8; margin-bottom: 25px;">
                We noticed you requested to reset your password for your <strong>BlogApp</strong> account.
                If you didn’t request this, you can safely ignore this email. Otherwise, click the button below to reset your password:
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="{resetURL}" 
                   style="display: inline-block; background: linear-gradient(90deg, #ff416c, #ff4b2b); color: #ffffff; text-decoration: none; padding: 14px 35px; font-size: 16px; font-weight: 600; border-radius: 30px; box-shadow: 0 3px 10px rgba(255, 65, 108, 0.3);">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #555; line-height: 1.7;">
                ⚠️ For your security, this link will expire in <strong>1 hour</strong>.  
                After it expires, you’ll need to submit a new password reset request.
              </p>

              <p style="margin-top: 35px; font-size: 15px;">
                Stay safe,<br>
                <strong>The BlogApp Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9f9f9; padding: 20px 10px; color: #777; font-size: 13px;">
              <p style="margin: 0;">This is an automated message, please do not reply.</p>
              <p style="margin: 5px 0 0;">&copy; BlogApp Team. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #00b09b, #96c93d); padding: 35px 20px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Password Reset Successful</h1>
              <p style="color: #eafbea; font-size: 15px; margin-top: 10px;">Your BlogApp account is now secure 🔒</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 35px 40px;">
              <p style="font-size: 16px; margin: 0 0 10px;">Hello <strong>{username}</strong>, 👋</p>
              <p style="font-size: 15px; line-height: 1.8; margin-bottom: 25px;">
                We're writing to let you know that your password has been successfully updated.  
                You can now log in to your <strong>BlogApp</strong> account using your new credentials.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #00b09b, #96c93d); color: #fff; font-size: 40px; line-height: 80px;">
                  ✓
                </div>
              </div>

              <p style="font-size: 15px; margin-bottom: 15px;">If you did not perform this password reset, please contact our support team immediately.</p>
              
              <p style="font-size: 15px; margin-bottom: 15px;">For better security, we recommend you:</p>
              <ul style="padding-left: 20px; font-size: 15px; color: #444; line-height: 1.8;">
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication (if available)</li>
                <li>Avoid reusing passwords across different sites</li>
              </ul>

              <p style="font-size: 15px; margin-top: 30px;">Thanks for keeping your account secure,<br><strong>The BlogApp Team</strong></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9f9f9; padding: 20px 10px; color: #777; font-size: 13px;">
              <p style="margin: 0;">This is an automated message. Please do not reply.</p>
              <p style="margin: 5px 0 0;">&copy; BlogApp Team. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;


export const PASSWORD_CHANGE_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Changed</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {username},</p>
    <p>This is a confirmation that your password was changed on {changeDate}.</p>
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
      <strong>⚠️ Security Notice:</strong>
      <p style="margin: 5px 0 0 0;">If you did not make this change, your account may be compromised. Please contact our support team immediately.</p>
    </div>
    <p>Changed from IP address: {ipAddress}</p>
    <p>Date and time: {changeDate}</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{supportURL}" style="background-color: #f44336; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Report Unauthorized Change</a>
    </div>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

