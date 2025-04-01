export const EMAIL_TEMPLATES = {
  RECRUITER_INVITATION: {
    SUBJECT: 'Invitation to join recruiting platform',
    BODY: (firstName: string, companyName: string, inviteLink: string) =>
      `
Hello ${firstName},

You have been invited to join ${companyName} as a recruiter.

Please click the following link to complete your registration:
${inviteLink}

This link will expire in 24 hours.

Best regards,
Recruiting Platform Team
    `.trim(),
  },

  COMPANY_CREATION: {
    SUBJECT: 'Welcome to Recruiting Platform',
    BODY: (companyName: string, adminName: string) =>
      `
Hello ${adminName},

Your company "${companyName}" has been successfully created on our recruiting platform.

You can now log in and start using all the features available to company administrators.

Best regards,
Recruiting Platform Team
    `.trim(),
  },

  FREELANCER_REGISTRATION: {
    SUBJECT: 'Welcome to Recruiting Platform',
    BODY: (firstName: string) =>
      `
Hello ${firstName},

Welcome to our recruiting platform! Your freelancer account has been successfully created.

You can now log in and start using all the features available to freelance recruiters.

Best regards,
Recruiting Platform Team
    `.trim(),
  },
  
  PRESCREEN_INVITATION: {
    SUBJECT: 'Pre-screening Interview Invitation',
    BODY: (candidateName: string, vacancyTitle: string, prescreenLink: string, expirationDate: Date) =>
      `
Hello ${candidateName},

You have been invited to complete a pre-screening for the ${vacancyTitle} position.

Please complete the pre-screening by clicking this link:
${prescreenLink}

This link will expire on ${expirationDate.toLocaleDateString()}.

Best regards,
Recruiting Platform Team
      `.trim(),
  },
};
