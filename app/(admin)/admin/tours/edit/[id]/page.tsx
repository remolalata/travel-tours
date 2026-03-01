import { adminContent } from '@/content/features/admin';
import AdminTourEditPage from '@/features/admin/AdminTourEditPage';

export const metadata = {
  title: adminContent.metadata.listing.title,
  description: adminContent.metadata.listing.description,
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const tourId = Number(id);

  return <AdminTourEditPage tourId={tourId} />;
}
