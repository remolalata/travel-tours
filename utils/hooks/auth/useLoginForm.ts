'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useMemo, useState } from 'react';

import { authContent } from '@/content/features/auth';
import { createClient } from '@/utils/supabase/client';

type LoginFieldErrors = {
  email: string;
  password: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getEmailValidationMessage(email: string) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return authContent.login.messages.emailRequired;
  }

  if (!isValidEmail(trimmedEmail)) {
    return authContent.login.messages.emailInvalid;
  }

  return '';
}

function getPasswordValidationMessage(password: string) {
  if (!password.trim()) {
    return authContent.login.messages.passwordRequired;
  }

  return '';
}

export default function useLoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setEmailValue = (value: string) => {
    setEmail(value);
    setFieldErrors((previous) => ({
      ...previous,
      email: previous.email ? getEmailValidationMessage(value) : previous.email,
    }));
  };

  const setPasswordValue = (value: string) => {
    setPassword(value);
    setFieldErrors((previous) => ({
      ...previous,
      password: previous.password ? getPasswordValidationMessage(value) : previous.password,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const nextFieldErrors = {
      email: getEmailValidationMessage(email),
      password: getPasswordValidationMessage(password),
    };

    setFieldErrors(nextFieldErrors);

    if (nextFieldErrors.email || nextFieldErrors.password) {
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage(authContent.login.messages.userVerificationFailed);
      setIsSubmitting(false);
      return;
    }

    const { data: userRole, error: userRoleError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (userRoleError) {
      setErrorMessage(authContent.login.messages.userVerificationFailed);
      setIsSubmitting(false);
      return;
    }

    router.replace(userRole?.role === 'admin' ? '/admin/dashboard' : '/');
    router.refresh();
  };

  return {
    email,
    password,
    fieldErrors,
    errorMessage,
    isSubmitting,
    setEmail: setEmailValue,
    setPassword: setPasswordValue,
    handleSubmit,
  };
}
