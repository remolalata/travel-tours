'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useMemo, useState } from 'react';

import { authContent } from '@/content/features/auth';
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
  getPhoneValidationMessage,
  getRequiredTextValidationMessage,
} from '@/utils/helpers/auth/authValidation';
import { getRandomAvatarUrl } from '@/utils/helpers/auth/avatarSelection';
import { createClient } from '@/utils/supabase/client';

type RegisterFieldErrors = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const DEFAULT_FORM_STATE: RegisterFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const DEFAULT_FIELD_ERRORS: RegisterFieldErrors = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function getConfirmPasswordValidationMessage(password: string, confirmPassword: string) {
  if (!confirmPassword.trim()) {
    return authContent.validation.confirmPasswordRequired;
  }

  if (password !== confirmPassword) {
    return authContent.validation.confirmPasswordMismatch;
  }

  return '';
}

function getFieldErrorMap(formState: RegisterFormState): RegisterFieldErrors {
  return {
    firstName: getRequiredTextValidationMessage(
      formState.firstName,
      authContent.validation.firstNameRequired,
    ),
    lastName: getRequiredTextValidationMessage(
      formState.lastName,
      authContent.validation.lastNameRequired,
    ),
    phone: getPhoneValidationMessage(formState.phone),
    email: getEmailValidationMessage(formState.email),
    password: getPasswordValidationMessage(formState.password),
    confirmPassword: getConfirmPasswordValidationMessage(
      formState.password,
      formState.confirmPassword,
    ),
  };
}

function isEmailAlreadyRegisteredError(message: string) {
  const normalizedMessage = message.toLowerCase();
  return (
    normalizedMessage.includes('already registered') ||
    normalizedMessage.includes('already been registered')
  );
}

export default function useRegisterForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [formState, setFormState] = useState<RegisterFormState>(DEFAULT_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>(DEFAULT_FIELD_ERRORS);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) {
    const nextState = {
      ...formState,
      [key]: value,
    };

    setFormState(nextState);

    setFieldErrors((previous) => {
      const nextErrors = getFieldErrorMap(nextState);

      return {
        ...previous,
        [key]: previous[key] ? nextErrors[key] : previous[key],
        ...(key === 'password' || key === 'confirmPassword'
          ? {
              confirmPassword: previous.confirmPassword
                ? nextErrors.confirmPassword
                : previous.confirmPassword,
            }
          : {}),
      };
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const nextFieldErrors = getFieldErrorMap(formState);
    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    const avatarUrl = getRandomAvatarUrl();
    const trimmedEmail = formState.email.trim();
    const trimmedFirstName = formState.firstName.trim();
    const trimmedLastName = formState.lastName.trim();
    const trimmedPhone = formState.phone.trim();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: formState.password,
      options: {
        data: {
          first_name: trimmedFirstName,
          last_name: trimmedLastName,
          phone: trimmedPhone || null,
          avatar_url: avatarUrl,
        },
      },
    });

    if (signUpError) {
      if (isEmailAlreadyRegisteredError(signUpError.message)) {
        setFieldErrors((previous) => ({
          ...previous,
          email: authContent.register.messages.emailAlreadyRegistered,
        }));
        setErrorMessage('');
      } else {
        setErrorMessage(signUpError.message || authContent.register.messages.signupFailed);
      }
      setIsSubmitting(false);
      return;
    }

    const userId = signUpData.user?.id;
    const session = signUpData.session;

    if (userId && session) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: userId,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        phone: trimmedPhone || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        setSuccessMessage(authContent.register.messages.profileSetupFailed);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(authContent.register.messages.successRedirecting);
      router.replace('/');
      router.refresh();
      return;
    }

    setSuccessMessage(authContent.register.messages.verifyEmail);
    setIsSubmitting(false);
  };

  return {
    formState,
    fieldErrors,
    errorMessage,
    successMessage,
    isSubmitting,
    setField,
    handleSubmit,
  };
}
