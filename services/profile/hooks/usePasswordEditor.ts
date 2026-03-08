'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { profilePageContent } from '@/content/features/profile';
import { updateCurrentPassword } from '@/services/profile/mutations/profileApi';
import type { ProfilePasswordFormState } from '@/types/profile';
import { validatePasswordForm } from '@/utils/helpers/formValidation';
import { createClient } from '@/utils/supabase/client';

const initialPasswordFormState: ProfilePasswordFormState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

type UsePasswordEditorOptions = {
  onUnauthorized: () => void;
};

type FormActionResult = {
  success: boolean;
  message: string;
};

export default function usePasswordEditor({ onUnauthorized }: UsePasswordEditorOptions) {
  const supabase = useMemo(() => createClient(), []);
  const { messages, validationMessages } = profilePageContent;
  const [passwordForm, setPasswordForm] =
    useState<ProfilePasswordFormState>(initialPasswordFormState);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<
    Partial<Record<keyof ProfilePasswordFormState, string>>
  >({});

  const mutation = useMutation({
    mutationFn: () => updateCurrentPassword(supabase, passwordForm),
  });

  const mapErrorCode = (code: string | undefined) =>
    code ? (validationMessages[code as keyof typeof validationMessages] ?? code) : undefined;

  const setPasswordField = (field: keyof ProfilePasswordFormState, value: string) => {
    setPasswordForm((previousValue) => ({ ...previousValue, [field]: value }));
    setPasswordFieldErrors((previousValue) => ({ ...previousValue, [field]: undefined }));
  };

  const savePassword = async (): Promise<FormActionResult> => {
    const validationErrors = validatePasswordForm(passwordForm);

    if (Object.keys(validationErrors).length > 0) {
      setPasswordFieldErrors({
        oldPassword: mapErrorCode(validationErrors.oldPassword),
        newPassword: mapErrorCode(validationErrors.newPassword),
        confirmPassword: mapErrorCode(validationErrors.confirmPassword),
      });
      return { success: false, message: messages.fixHighlightedFields };
    }

    setPasswordFieldErrors({});

    try {
      await mutation.mutateAsync();
      setPasswordForm(initialPasswordFormState);
      return { success: true, message: messages.passwordSaved };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage === 'UNAUTHORIZED') {
        onUnauthorized();
        return { success: false, message: messages.sessionExpired };
      }

      if (errorMessage === 'OLD_PASSWORD_INCORRECT') {
        setPasswordFieldErrors({
          oldPassword: messages.passwordOldIncorrect,
        });
        return { success: false, message: messages.passwordOldIncorrect };
      }

      if (errorMessage.startsWith('PASSWORD_UPDATE_FAILED:')) {
        return { success: false, message: errorMessage.replace('PASSWORD_UPDATE_FAILED:', '') };
      }

      return { success: false, message: messages.fixHighlightedFields };
    }
  };

  return {
    passwordForm,
    passwordFieldErrors,
    isSavingPassword: mutation.isPending,
    setPasswordField,
    savePassword,
  };
}
