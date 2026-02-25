'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { saveCurrentAdminProfile } from '@/services/admin/profile/mutations/profileApi';
import { adminProfileQueryKeys } from '@/services/admin/profile/queries/profileQueryKeys';
import { adminContent } from '@/content/features/admin';
import type { AdminProfileFormState } from '@/types/admin';
import { validateAdminProfileForm } from '@/utils/helpers/formValidation';
import { createClient } from '@/utils/supabase/client';

const initialProfileFormState: AdminProfileFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

type UseAdminProfileEditorOptions = {
  onUnauthorized: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    avatarUrl: string | null;
  };
};

type FormActionResult = {
  success: boolean;
  message: string;
};

export default function useAdminProfileEditor({
  onUnauthorized,
  initialData,
}: UseAdminProfileEditorOptions) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const profileContent = adminContent.pages.profile;

  const [profileForm, setProfileForm] = useState<AdminProfileFormState>({
    ...initialProfileFormState,
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    phone: initialData.phone,
    email: initialData.email,
  });
  const [profileFieldErrors, setProfileFieldErrors] = useState<
    Partial<Record<keyof AdminProfileFormState, string>>
  >({});
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      saveCurrentAdminProfile(supabase, {
        profileForm,
        avatarFile,
        removeAvatar,
        currentAvatarUrl: avatarPreview,
      }),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(adminProfileQueryKeys.detail(), updatedProfile);
    },
  });

  const mapErrorCode = (code: string | undefined) =>
    code ? (profileContent.validationMessages[code] ?? code) : undefined;

  const setProfileField = (field: keyof AdminProfileFormState, value: string) => {
    setProfileForm((previousValue) => ({ ...previousValue, [field]: value }));
    setProfileFieldErrors((previousValue) => ({ ...previousValue, [field]: undefined }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(fileUrl);
    setRemoveAvatar(false);
  };

  const clearAvatar = () => {
    setAvatarPreview('');
    setAvatarFile(null);
    setRemoveAvatar(true);
  };

  const saveProfile = async (): Promise<FormActionResult> => {
    const validationErrors = validateAdminProfileForm(profileForm);
    if (Object.keys(validationErrors).length > 0) {
      setProfileFieldErrors({
        firstName: mapErrorCode(validationErrors.firstName),
        lastName: mapErrorCode(validationErrors.lastName),
        phone: mapErrorCode(validationErrors.phone),
        email: mapErrorCode(validationErrors.email),
      });
      return { success: false, message: profileContent.messages.fixHighlightedFields };
    }

    setProfileFieldErrors({});

    try {
      await mutation.mutateAsync();
      setAvatarFile(null);
      setRemoveAvatar(false);
      return { success: true, message: profileContent.messages.profileSaved };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage === 'UNAUTHORIZED') {
        onUnauthorized();
        return { success: false, message: profileContent.messages.sessionExpired };
      }
      if (errorMessage.startsWith('UPLOAD_ERROR:')) {
        return {
          success: false,
          message: `${profileContent.messages.profileUploadFailedPrefix}: ${errorMessage.replace('UPLOAD_ERROR:', '')}`,
        };
      }
      if (errorMessage === 'PROFILE_SAVE_FAILED') {
        return { success: false, message: profileContent.messages.profileTableMissing };
      }
      if (errorMessage.startsWith('EMAIL_UPDATE_FAILED:')) {
        return { success: false, message: errorMessage.replace('EMAIL_UPDATE_FAILED:', '') };
      }

      return { success: false, message: profileContent.messages.profileTableMissing };
    }
  };

  return {
    profileForm,
    profileFieldErrors,
    avatarPreview,
    isSavingProfile: mutation.isPending,
    setProfileField,
    handleImageChange,
    clearAvatar,
    saveProfile,
  };
}
