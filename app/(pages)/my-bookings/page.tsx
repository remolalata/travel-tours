import { myBookingsPageContent } from '@/content/features/myBookings';
import MyBookingsPage from '@/features/my-bookings/MyBookingsPage';
import { fetchAuthViewerState } from '@/services/auth/mutations/authApi';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: myBookingsPageContent.metadata.title,
  description: myBookingsPageContent.metadata.description,
};

export default async function Page() {
  const supabase = await createClient();
  const initialAuthState = await fetchAuthViewerState(supabase);

  return <MyBookingsPage initialAuthState={initialAuthState} />;
}
