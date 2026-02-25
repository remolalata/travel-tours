import type { SupabaseClient } from '@supabase/supabase-js';

import type { AdminPasswordFormState, AdminProfileFormState } from '@/types/admin';

export type AdminProfileData = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
};

export type SaveAdminProfileInput = {
  profileForm: AdminProfileFormState;
  avatarFile: File | null;
  removeAvatar: boolean;
  currentAvatarUrl: string;
};

function getProfilePhotoStoragePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;

  const bucketPublicPathMarker = '/storage/v1/object/public/profile-photos/';

  try {
    const parsedUrl = new URL(url);
    const markerIndex = parsedUrl.pathname.indexOf(bucketPublicPathMarker);
    if (markerIndex === -1) return null;

    const path = parsedUrl.pathname.slice(markerIndex + bucketPublicPathMarker.length);
    return decodeURIComponent(path);
  } catch {
    return null;
  }
}

export async function fetchCurrentAdminProfile(
  supabase: SupabaseClient,
): Promise<AdminProfileData> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('first_name,last_name,phone,avatar_url')
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? '',
    firstName: profileData?.first_name ?? '',
    lastName: profileData?.last_name ?? '',
    phone: profileData?.phone ?? '',
    avatarUrl: profileData?.avatar_url ?? null,
  };
}

export async function saveCurrentAdminProfile(
  supabase: SupabaseClient,
  input: SaveAdminProfileInput,
): Promise<AdminProfileData> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  const { data: existingProfileData } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('user_id', user.id)
    .maybeSingle();
  const existingAvatarUrl = existingProfileData?.avatar_url ?? null;

  let avatarUrl: string | null = input.removeAvatar ? null : input.currentAvatarUrl || null;

  if (input.avatarFile) {
    const fileExtension = input.avatarFile.name.split('.').pop() ?? 'jpg';
    const filePath = `${user.id}/${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, input.avatarFile, { upsert: true });

    if (uploadError) {
      throw new Error(`UPLOAD_ERROR:${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
    avatarUrl = publicUrlData.publicUrl;
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    user_id: user.id,
    first_name: input.profileForm.firstName.trim(),
    last_name: input.profileForm.lastName.trim(),
    phone: input.profileForm.phone.trim(),
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    throw new Error('PROFILE_SAVE_FAILED');
  }

  if (input.profileForm.email.trim() !== (user.email ?? '')) {
    const { error: emailUpdateError } = await supabase.auth.updateUser({
      email: input.profileForm.email.trim(),
    });

    if (emailUpdateError) {
      throw new Error(`EMAIL_UPDATE_FAILED:${emailUpdateError.message}`);
    }
  }

  await supabase.auth.updateUser({
    data: {
      first_name: input.profileForm.firstName.trim(),
      last_name: input.profileForm.lastName.trim(),
      phone: input.profileForm.phone.trim(),
      avatar_url: avatarUrl,
    },
  });

  const shouldDeleteOldAvatar = Boolean(existingAvatarUrl) && existingAvatarUrl !== avatarUrl;
  if (shouldDeleteOldAvatar) {
    const oldAvatarPath = getProfilePhotoStoragePathFromPublicUrl(existingAvatarUrl);
    if (oldAvatarPath) {
      await supabase.storage.from('profile-photos').remove([oldAvatarPath]);
    }
  }

  return {
    userId: user.id,
    email: input.profileForm.email.trim(),
    firstName: input.profileForm.firstName.trim(),
    lastName: input.profileForm.lastName.trim(),
    phone: input.profileForm.phone.trim(),
    avatarUrl,
  };
}

export async function updateCurrentAdminPassword(
  supabase: SupabaseClient,
  input: AdminPasswordFormState,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error('UNAUTHORIZED');
  }

  const { error: verifyOldPasswordError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: input.oldPassword,
  });

  if (verifyOldPasswordError) {
    throw new Error('OLD_PASSWORD_INCORRECT');
  }

  const { error: updatePasswordError } = await supabase.auth.updateUser({
    password: input.newPassword,
  });

  if (updatePasswordError) {
    throw new Error(`PASSWORD_UPDATE_FAILED:${updatePasswordError.message}`);
  }
}
