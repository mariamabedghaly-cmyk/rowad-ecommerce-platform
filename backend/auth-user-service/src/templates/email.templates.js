const welcomeEmail = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #4CAF50;">Welcome to Our Store! 🎉</h1>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering. Your account is active and ready to go.</p>
</div>`;

const forgotPasswordEmail = (name, resetUrl) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #2196F3;">Reset Your Password 🔑</h1>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link expires in 1 hour.</p>
</div>`;

module.exports = { welcomeEmail, forgotPasswordEmail };
