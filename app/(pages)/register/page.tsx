import { authContent } from '@/content/features/auth';
import RegisterPage from '@/features/auth/RegisterPage';

export const dynamic = 'force-static';

export const metadata = {
  title: authContent.register.metadata.title,
  description: authContent.register.metadata.description,
};

export default function Page() {
  return <RegisterPage />;
}
