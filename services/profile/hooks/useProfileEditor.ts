'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';

import { profilePageContent } from '@/content/features/profile';
import { authQueryKeys } from '@/services/auth/queries/authQueryKeys';
import { saveCurrentProfile } from '@/services/profile/mutations/profileApi';
import { profileQueryKeys } from '@/services/profile/queries/profileQueryKeys';
import type { ProfileFormState } from '@/types/profile';
import { validateProfileForm } from '@/utils/helpers/formValidation';
import { buildProfileDisplayName } from '@/utils/helpers/profile';
import { createClient } from '@/utils/supabase/client';

const initialProfileFormState: ProfileFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

type UseProfileEditorOptions = {
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

export default function useProfileEditor({ onUnauthorized, initialData }: UseProfileEditorOptions) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const { messages, overview, validationMessages } = profilePageContent;
  const persistedProfileRef = useRef({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    phone: initialData.phone,
    email: initialData.email,
    avatarUrl: initialData.avatarUrl ?? '',
  });

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    ...initialProfileFormState,
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    phone: initialData.phone,
    email: initialData.email,
  });
  const [profileFieldErrors, setProfileFieldErrors] = useState<
    Partial<Record<keyof ProfileFormState, string>>
  >({});
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const mutation = useMutation({
    mutationFn: (input: {
      profileForm: ProfileFormState;
      avatarFile: File | null;
      removeAvatar: boolean;
      currentAvatarUrl: string;
    }) =>
      saveCurrentProfile(supabase, {
        profileForm: input.profileForm,
        avatarFile: input.avatarFile,
        removeAvatar: input.removeAvatar,
        currentAvatarUrl: input.currentAvatarUrl,
      }),
    onSuccess: (updatedProfile) => {
      persistedProfileRef.current = {
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        phone: updatedProfile.phone,
        email: updatedProfile.email,
        avatarUrl: updatedProfile.avatarUrl ?? '',
      };
      queryClient.setQueryData(profileQueryKeys.detail(), updatedProfile);
      queryClient.setQueryData(authQueryKeys.viewer(), (currentValue: unknown) => {
        if (!currentValue || typeof currentValue !== 'object') {
          return currentValue;
        }

        return {
          ...currentValue,
          avatarUrl: updatedProfile.avatarUrl,
          email: updatedProfile.email,
          fullName: buildProfileDisplayName({
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            email: updatedProfile.email,
            fallbackName: overview.fallbackName,
          }),
          phone: updatedProfile.phone,
        };
      });
    },
  });

  const mapErrorCode = (code: string | undefined) =>
    code ? (validationMessages[code as keyof typeof validationMessages] ?? code) : undefined;

  const setProfileField = (field: keyof ProfileFormState, value: string) => {
    setProfileForm((previousValue) => ({ ...previousValue, [field]: value }));
    setProfileFieldErrors((previousValue) => ({ ...previousValue, [field]: undefined }));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<FormActionResult> => {
    const file = event.target.files?.[0];

    if (!file) {
      return { success: false, message: '' };
    }

    const fileUrl = URL.createObjectURL(file);
    const previousAvatarPreview = avatarPreview;
    setAvatarFile(file);
    setAvatarPreview(fileUrl);
    setRemoveAvatar(false);

    try {
      await mutation.mutateAsync({
        profileForm: {
          firstName: persistedProfileRef.current.firstName,
          lastName: persistedProfileRef.current.lastName,
          phone: persistedProfileRef.current.phone,
          email: persistedProfileRef.current.email,
        },
        avatarFile: file,
        removeAvatar: false,
        currentAvatarUrl: persistedProfileRef.current.avatarUrl,
      });
      setAvatarFile(null);
      event.target.value = '';
      return { success: true, message: messages.profileSaved };
    } catch (error) {
      setAvatarFile(null);
      setAvatarPreview(previousAvatarPreview);

      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage === 'UNAUTHORIZED') {
        onUnauthorized();
        return { success: false, message: messages.sessionExpired };
      }

      if (errorMessage.startsWith('UPLOAD_ERROR:')) {
        return {
          success: false,
          message: `${messages.profileUploadFailedPrefix}: ${errorMessage.replace('UPLOAD_ERROR:', '')}`,
        };
      }

      return { success: false, message: messages.profileSaveFailed };
    }
  };

  const clearAvatar = () => {
    setAvatarPreview('');
    setAvatarFile(null);
    setRemoveAvatar(true);
  };

  const saveProfile = async (): Promise<FormActionResult> => {
    const validationErrors = validateProfileForm(profileForm);

    if (Object.keys(validationErrors).length > 0) {
      setProfileFieldErrors({
        firstName: mapErrorCode(validationErrors.firstName),
        lastName: mapErrorCode(validationErrors.lastName),
        phone: mapErrorCode(validationErrors.phone),
        email: mapErrorCode(validationErrors.email),
      });
      return { success: false, message: messages.fixHighlightedFields };
    }

    setProfileFieldErrors({});

    try {
      await mutation.mutateAsync({
        profileForm,
        avatarFile,
        removeAvatar,
        currentAvatarUrl: avatarPreview,
      });
      setAvatarFile(null);
      setRemoveAvatar(false);
      return { success: true, message: messages.profileSaved };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage === 'UNAUTHORIZED') {
        onUnauthorized();
        return { success: false, message: messages.sessionExpired };
      }

      if (errorMessage.startsWith('UPLOAD_ERROR:')) {
        return {
          success: false,
          message: `${messages.profileUploadFailedPrefix}: ${errorMessage.replace('UPLOAD_ERROR:', '')}`,
        };
      }

      if (errorMessage === 'PROFILE_SAVE_FAILED') {
        return { success: false, message: messages.profileSaveFailed };
      }

      if (errorMessage.startsWith('EMAIL_UPDATE_FAILED:')) {
        return { success: false, message: errorMessage.replace('EMAIL_UPDATE_FAILED:', '') };
      }

      return { success: false, message: messages.profileSaveFailed };
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
