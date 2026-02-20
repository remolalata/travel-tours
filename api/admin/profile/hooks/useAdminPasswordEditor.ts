'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { updateCurrentAdminPassword } from '@/api/admin/profile/mutations/profileApi';
import { adminContent } from '@/content/features/admin';
import type { AdminPasswordFormState } from '@/types/admin';
import { validateAdminPasswordForm } from '@/utils/helpers/formValidation';
import { createClient } from '@/utils/supabase/client';

const initialPasswordFormState: AdminPasswordFormState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

type UseAdminPasswordEditorOptions = {
  onUnauthorized: () => void;
};

type FormActionResult = {
  success: boolean;
  message: string;
};

export default function useAdminPasswordEditor({ onUnauthorized }: UseAdminPasswordEditorOptions) {
  const supabase = useMemo(() => createClient(), []);
  const profileContent = adminContent.pages.profile;
  const [passwordForm, setPasswordForm] = useState<AdminPasswordFormState>(initialPasswordFormState);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<
    Partial<Record<keyof AdminPasswordFormState, string>>
  >({});

  const mutation = useMutation({
    mutationFn: () => updateCurrentAdminPassword(supabase, passwordForm),
  });

  const mapErrorCode = (code: string | undefined) =>
    code ? profileContent.validationMessages[code] ?? code : undefined;

  const setPasswordField = (field: keyof AdminPasswordFormState, value: string) => {
    setPasswordForm((previousValue) => ({ ...previousValue, [field]: value }));
    setPasswordFieldErrors((previousValue) => ({ ...previousValue, [field]: undefined }));
  };

  const savePassword = async (): Promise<FormActionResult> => {
    const validationErrors = validateAdminPasswordForm(passwordForm);
    if (Object.keys(validationErrors).length > 0) {
      setPasswordFieldErrors({
        oldPassword: mapErrorCode(validationErrors.oldPassword),
        newPassword: mapErrorCode(validationErrors.newPassword),
        confirmPassword: mapErrorCode(validationErrors.confirmPassword),
      });
      return { success: false, message: profileContent.messages.fixHighlightedFields };
    }
    setPasswordFieldErrors({});

    try {
      await mutation.mutateAsync();
      setPasswordForm(initialPasswordFormState);
      return { success: true, message: profileContent.messages.passwordSaved };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage === 'UNAUTHORIZED') {
        onUnauthorized();
        return { success: false, message: profileContent.messages.sessionExpired };
      }
      if (errorMessage === 'OLD_PASSWORD_INCORRECT') {
        setPasswordFieldErrors({
          oldPassword: profileContent.messages.passwordOldIncorrect,
        });
        return { success: false, message: profileContent.messages.passwordOldIncorrect };
      }
      if (errorMessage.startsWith('PASSWORD_UPDATE_FAILED:')) {
        return { success: false, message: errorMessage.replace('PASSWORD_UPDATE_FAILED:', '') };
      }

      return { success: false, message: profileContent.messages.fixHighlightedFields };
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
