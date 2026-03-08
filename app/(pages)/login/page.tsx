import { authContent } from '@/content/features/auth';
import LoginPage from '@/features/auth/LoginPage';

export const dynamic = 'force-static';

export const metadata = {
  title: authContent.login.metadata.title,
  description: authContent.login.metadata.description,
};

export default function Page() {
  return <LoginPage />;
}
