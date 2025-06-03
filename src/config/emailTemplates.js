export const EMAIL_VERIFY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <div style="text-align: center;">
    <img src="https://i.ibb.co/gL56LmNZ/logo.png" alt="MERN Logo" width="120" style="margin-bottom: 20px;" />
  </div>
  <h2 style="color: #2c3e50;">Verify Your Email</h2>
  <p>Hello,</p>
  <p>We received a request to verify your email address: <strong>{{email}}</strong>.</p>
  <p>Please use the following OTP to complete your verification process:</p>
  <div style="background-color: #f3f3f3; padding: 10px 20px; margin: 20px 0; font-size: 24px; letter-spacing: 3px; font-weight: bold; text-align: center; border-radius: 5px;">
    {{otp}}
  </div>
  <p>This OTP is valid for a limited time. Do not share it with anyone.</p>
  <p>If you didn’t request this, you can safely ignore this email.</p>
  <hr style="margin: 30px 0;" />
  <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} LV's Mern-Stack-Authentication. All rights reserved.</p>
</div>
`;

export const PASSWORD_RESET_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <div style="text-align: center;">
    <img src="https://i.ibb.co/gL56LmNZ/logo.png" alt="MERN Logo" width="120" style="margin-bottom: 20px;" />
  </div>
  <h2 style="color: #e67e22;">Reset Your Password</h2>
  <p>Hello,</p>
  <p>We received a request to reset the password for the account associated with this email: <strong>{{email}}</strong>.</p>
  <p>Please use the OTP below to proceed with resetting your password:</p>
  <div style="background-color: #f3f3f3; padding: 10px 20px; margin: 20px 0; font-size: 24px; letter-spacing: 3px; font-weight: bold; text-align: center; border-radius: 5px;">
    {{otp}}
  </div>
  <p>This OTP is valid for a limited time and should not be shared with anyone.</p>
  <p>If you did not request this, please ignore this email or contact support.</p>
  <hr style="margin: 30px 0;" />
  <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} LV's Mern-Stack-Authentication. All rights reserved.</p>
</div>
`;
