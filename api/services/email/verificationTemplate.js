module.exports = token => {
  // email template to be used when verifying users who recently created an account
  return `
      <html>
        <body>
          <div style="text-align: center;">
            <h2>Please confirm your email</h2>
            <p style="margin: 16px; font-size: 16px">Please click the following link to confirm your email address.</p>
            <div style="margin: 16px;">
                <a style="color:#4551B5; font-size: 16px;" href="${process.env.REDIRECT_DOMAIN}/email/confirmation/${token}">Confirm Email</a>
            </div>
          </div>
        </body>
      </html>
    `;
};
