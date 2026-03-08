import { adminContent } from '@/content/features/admin';
import ProfilePage from '@/features/admin/profile/ProfilePage';

export const metadata = {
  title: adminContent.metadata.profile.title,
  description: adminContent.metadata.profile.description,
};

export default function Page() {
  return <ProfilePage />;
}
