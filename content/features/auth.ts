export const authContent = {
  login: {
    metadata: {
      title: 'Login',
      description: 'Sign in to access your account.',
    },
    heading: 'Log In',
    subheading: 'Access your account.',
    helpPrefix: 'Need help?',
    helpLinkLabel: 'Contact support.',
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
      emailRequired: 'Email address is required.',
      emailInvalid: 'Enter a valid email address.',
      passwordRequired: 'Password is required.',
    },
  },
} as const;
