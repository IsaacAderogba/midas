module.exports = (inviteDetails, invitedUser) => {
  // email template to be used when inviting users to join a workspace
  return `
      <html>
        <body>
          <div style="text-align: center;">
            <h2>${inviteDetails.firstName} ${inviteDetails.lastName} has invited you to ${inviteDetails.workspaceName}'s workspace</h2>
            <p style="margin: 16px; font-size: 16px">There you will be able to collaborate on wireframes.</p>
            <div style="margin: 16px;">
                <a style="color:#4551B5; font-size: 16px;" href="${process.env.REDIRECT_DOMAIN}/invite/${invitedUser.email}/${invitedUser.role}/${invitedUser.workspaceUserId}/${invitedUser.workspaceId}">Accept Invite</a>
            </div>
          </div>
        </body>
      </html>
    `;
};
