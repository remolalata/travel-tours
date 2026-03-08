import type { ProfilePageContent } from '@/types/profile';

export const profilePageContent: ProfilePageContent = {
  metadata: {
    title: 'Profile | Travel & Tours',
    description: 'Manage your account details, contact information, and password.',
  },
  intro: {
    title: 'My Profile',
    description: 'Keep your account details up to date for a smoother booking experience.',
  },
  overview: {
    title: 'Account Overview',
    description: 'Review your current profile details and profile photo.',
    fallbackName: 'Traveler',
    avatar: {
      imageAlt: 'Profile photo',
      uploadLabel: 'Upload Photo',
      emptyLabel: 'Add a profile photo',
    },
    details: {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
    },
  },
  personalInfo: {
    title: 'Personal Information',
    description: 'Update the information we use for your account and trip coordination.',
    submitLabel: 'Save Changes',
    savingLabel: 'Saving...',
    fields: [
      { id: 'first-name', label: 'First Name' },
      { id: 'last-name', label: 'Last Name' },
      { id: 'email', label: 'Email' },
      { id: 'phone', label: 'Phone' },
    ],
  },
  security: {
    title: 'Security',
    description: 'Change your password to keep your account secure.',
    submitLabel: 'Update Password',
    savingLabel: 'Saving...',
    fields: [
      { id: 'old-password', label: 'Current Password' },
      { id: 'new-password', label: 'New Password' },
      { id: 'confirm-password', label: 'Confirm New Password' },
    ],
  },
  shortcuts: {
    title: 'Need Your Trips?',
    description: 'View your upcoming and past reservations in one place.',
    ctaLabel: 'Go to My Bookings',
    ctaHref: '/my-bookings',
  },
  messages: {
    loading: 'Loading profile...',
    loadError: 'Unable to load your profile right now.',
    retry: 'Try Again',
    fixHighlightedFields: 'Please fix the highlighted fields.',
    sessionExpired: 'Session expired. Please sign in again.',
    profileUploadFailedPrefix: 'Profile photo upload failed',
    profileSaveFailed: 'Unable to save your profile right now.',
    profileSaved: 'Profile saved successfully.',
    passwordOldIncorrect: 'Current password is incorrect.',
    passwordSaved: 'Password updated successfully.',
  },
  validationMessages: {
    required_first_name: 'First name is required.',
    required_last_name: 'Last name is required.',
    required_phone: 'Phone number is required.',
    invalid_phone: 'Please enter a valid phone number.',
    required_email: 'Email is required.',
    invalid_email: 'Please enter a valid email address.',
    required_old_password: 'Current password is required.',
    required_new_password: 'New password is required.',
    invalid_new_password_length: 'New password must be at least 8 characters.',
    invalid_new_password_pattern: 'Password must include at least one letter and one number.',
    required_confirm_password: 'Please confirm your new password.',
    mismatch_confirm_password: 'New password and confirmation do not match.',
    same_as_old_password: 'New password must be different from your current password.',
  },
};
