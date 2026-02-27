'use client';

import type { User } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useMemo, useState } from 'react';

import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from '@/utils/helpers/auth/authValidation';
import { createClient } from '@/utils/supabase/client';

type LoginFieldErrors = {
  email: string;
  password: string;
};

export default function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const nextParam = searchParams.get('next');
  const redirectPath =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

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

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    // Prefer the user returned from the sign-in response to avoid session-sync races on prod.
    let user: User | null = signInData.user ?? null;
    if (!user) {
      const {
        data: { user: fetchedUser },
      } = await supabase.auth.getUser();
      user = fetchedUser ?? null;
    }

    if (!user) {
      router.replace(redirectPath);
      router.refresh();
      return;
    }

    const { error: userRoleError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (userRoleError) {
      router.replace(redirectPath);
      router.refresh();
      return;
    }

    router.replace(redirectPath);
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
