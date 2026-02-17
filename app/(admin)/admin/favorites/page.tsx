import { adminContent } from '@/content/features/admin';
import AdminFavoritesPage from '@/features/admin/AdminFavoritesPage';

export const metadata = {
  title: adminContent.metadata.favorites.title,
  description: adminContent.metadata.favorites.description,
};

export default function Page() {
  return <AdminFavoritesPage />;
}
