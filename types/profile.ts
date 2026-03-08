export interface ProfileMetadata {
  title: string;
  description: string;
}

export interface ProfileFormField {
  id: 'first-name' | 'last-name' | 'email' | 'phone';
  label: string;
}

export interface ProfilePasswordField {
  id: 'old-password' | 'new-password' | 'confirm-password';
  label: string;
}

export interface ProfileOverviewContent {
  title: string;
  description: string;
  fallbackName: string;
  avatar: {
    imageAlt: string;
    uploadLabel: string;
    emptyLabel: string;
  };
  details: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface ProfileFormSectionContent {
  title: string;
  description: string;
  submitLabel: string;
  savingLabel: string;
  fields: ProfileFormField[];
}

export interface ProfileSecuritySectionContent {
  title: string;
  description: string;
  submitLabel: string;
  savingLabel: string;
  fields: ProfilePasswordField[];
}

export interface ProfileShortcutSectionContent {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ProfileMessages {
  loading: string;
  loadError: string;
  retry: string;
  fixHighlightedFields: string;
  sessionExpired: string;
  profileUploadFailedPrefix: string;
  profileSaveFailed: string;
  profileSaved: string;
  passwordOldIncorrect: string;
  passwordSaved: string;
}

export interface ProfileValidationMessages {
  required_first_name: string;
  required_last_name: string;
  required_phone: string;
  invalid_phone: string;
  required_email: string;
  invalid_email: string;
  required_old_password: string;
  required_new_password: string;
  invalid_new_password_length: string;
  invalid_new_password_pattern: string;
  required_confirm_password: string;
  mismatch_confirm_password: string;
  same_as_old_password: string;
}

export interface ProfilePageContent {
  metadata: ProfileMetadata;
  intro: {
    title: string;
    description: string;
  };
  overview: ProfileOverviewContent;
  personalInfo: ProfileFormSectionContent;
  security: ProfileSecuritySectionContent;
  shortcuts: ProfileShortcutSectionContent;
  messages: ProfileMessages;
  validationMessages: ProfileValidationMessages;
}

export type ProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type ProfilePasswordFormState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ProfileData = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
};
