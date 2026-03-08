import { profilePageContent } from '@/content/features/profile';
import ProfilePage from '@/features/profile/ProfilePage';
import { fetchAuthViewerState } from '@/services/auth/mutations/authApi';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: profilePageContent.metadata.title,
  description: profilePageContent.metadata.description,
};

export default async function Page() {
  const supabase = await createClient();
  const initialAuthState = await fetchAuthViewerState(supabase);

  return <ProfilePage initialAuthState={initialAuthState} />;
}
