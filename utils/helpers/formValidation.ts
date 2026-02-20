import type { AdminPasswordFormState, AdminProfileFormState } from '@/types/admin';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[\d\s\-()]{7,20}$/;

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateAdminProfileForm(input: AdminProfileFormState): ValidationErrors<AdminProfileFormState> {
  const errors: ValidationErrors<AdminProfileFormState> = {};

  if (!input.firstName.trim()) errors.firstName = 'required_first_name';
  if (!input.lastName.trim()) errors.lastName = 'required_last_name';
  if (!input.phone.trim()) errors.phone = 'required_phone';
  else if (!phonePattern.test(input.phone.trim())) errors.phone = 'invalid_phone';
  if (!input.email.trim()) errors.email = 'required_email';
  else if (!emailPattern.test(input.email.trim())) errors.email = 'invalid_email';

  return errors;
}

export function validateAdminPasswordForm(
  input: AdminPasswordFormState,
): ValidationErrors<AdminPasswordFormState> {
  const errors: ValidationErrors<AdminPasswordFormState> = {};

  if (!input.oldPassword) errors.oldPassword = 'required_old_password';
  if (!input.newPassword) errors.newPassword = 'required_new_password';
  else {
    if (input.newPassword.length < 8) errors.newPassword = 'invalid_new_password_length';
    else if (!/[A-Za-z]/.test(input.newPassword) || !/\d/.test(input.newPassword)) {
      errors.newPassword = 'invalid_new_password_pattern';
    }
  }

  if (!input.confirmPassword) errors.confirmPassword = 'required_confirm_password';
  else if (input.newPassword !== input.confirmPassword) {
    errors.confirmPassword = 'mismatch_confirm_password';
  }

  if (!errors.newPassword && input.newPassword === input.oldPassword) {
    errors.newPassword = 'same_as_old_password';
  }

  return errors;
}
