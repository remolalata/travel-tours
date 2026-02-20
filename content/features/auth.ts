export const authContent = {
  login: {
    metadata: {
      title: 'Admin Login',
      description: 'Sign in to access the admin dashboard.',
    },
    heading: 'Log In',
    subheading: 'Admin access only.',
    helpPrefix: 'Need an account? Contact site administrators or',
    helpLinkLabel: 'request access.',
    fields: {
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
    },
    actions: {
      submitLabel: 'Log In',
      submittingLabel: 'Logging in...',
    },
    messages: {
      userVerificationFailed: 'Unable to verify your account. Please try again.',
      unauthorizedAdmin: 'This account is not allowed to access the admin area.',
    },
  },
} as const;
