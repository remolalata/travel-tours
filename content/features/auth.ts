export const authContent = {
  validation: {
    emailRequired: 'Email address is required.',
    emailInvalid: 'Enter a valid email address.',
    passwordRequired: 'Password is required.',
    passwordMinLength: 8,
    passwordTooShort: 'Password must be at least {min} characters.',
    firstNameRequired: 'First name is required.',
    lastNameRequired: 'Last name is required.',
    confirmPasswordRequired: 'Please confirm your password.',
    confirmPasswordMismatch: 'Passwords do not match.',
    phoneInvalid: 'Please enter a valid phone number.',
  },
  login: {
    metadata: {
      title: 'Login',
      description: 'Sign in to access your account.',
    },
    heading: 'Log In',
    subheading: 'Access your account.',
    helpPrefix: 'Need help?',
    helpLinkLabel: 'Contact support.',
    helpLinkHref: '/contact',
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
    },
  },
  register: {
    metadata: {
      title: 'Register',
      description: 'Create your account to manage bookings and trips.',
    },
    heading: 'Sign Up',
    subheading: 'Create your account.',
    helpPrefix: 'Need help?',
    helpLinkLabel: 'Contact support.',
    helpLinkHref: '/contact',
    fields: {
      firstNameLabel: 'First Name',
      lastNameLabel: 'Last Name',
      phoneLabel: 'Phone Number',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
    },
    actions: {
      submitLabel: 'Create Account',
      submittingLabel: 'Creating account...',
    },
    messages: {
      emailAlreadyRegistered: 'This email is already registered. Try logging in instead.',
      profileSetupFailed:
        'Your account was created, but we could not finish setting up your profile. Please log in and update your profile.',
      signupFailed: 'Unable to create your account. Please try again.',
      verifyEmail:
        'Account created. Please check your email to verify your account before logging in.',
      successRedirecting: 'Account created successfully. Redirecting...',
    },
  },
} as const;
