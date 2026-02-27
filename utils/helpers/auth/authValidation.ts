import { authContent } from '@/content/features/auth';

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getEmailValidationMessage(email: string) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return authContent.validation.emailRequired;
  }

  if (!isValidEmail(trimmedEmail)) {
    return authContent.validation.emailInvalid;
  }

  return '';
}

export function getPasswordValidationMessage(password: string) {
  if (!password.trim()) {
    return authContent.validation.passwordRequired;
  }

  if (password.length < authContent.validation.passwordMinLength) {
    return authContent.validation.passwordTooShort.replace(
      '{min}',
      String(authContent.validation.passwordMinLength),
    );
  }

  return '';
}

export function getRequiredTextValidationMessage(value: string, message: string, minLength = 1) {
  if (value.trim().length < minLength) {
    return message;
  }

  return '';
}

export function getPhoneValidationMessage(phone: string) {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    return '';
  }

  const normalized = trimmedPhone.replace(/[\s()+-]/g, '');

  if (!/^\d{10,15}$/.test(normalized)) {
    return authContent.validation.phoneInvalid;
  }

  return '';
}
