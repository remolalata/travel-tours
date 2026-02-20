'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useMemo, useState } from 'react';

import { authContent } from '@/content/features/auth';
import { createClient } from '@/utils/supabase/client';

export default function useLoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

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

    const { data: adminUser, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminCheckError || !adminUser) {
      await supabase.auth.signOut();
      setErrorMessage(authContent.login.messages.unauthorizedAdmin);
      setIsSubmitting(false);
      return;
    }

    router.replace('/admin/dashboard');
    router.refresh();
  };

  return {
    email,
    password,
    errorMessage,
    isSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
