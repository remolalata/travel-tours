import ContactForm from '@/components/contact/sections/ContactForm';
import Locations from '@/components/contact/sections/Locations';
import Map from '@/components/contact/sections/Map';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { contactPageContent } from '@/content/features/contact';
import type { AuthViewerState } from '@/services/auth/mutations/authApi';

export const dynamic = 'force-static';

const guestAuthState: AuthViewerState = {
  isAuthenticated: false,
  role: null,
  avatarUrl: null,
  fullName: null,
  email: null,
  phone: null,
};

export const metadata = {
  title: contactPageContent.metadata.title,
  description: contactPageContent.metadata.description,
};

export default function page() {
  return (
    <>
      <main>
        <SiteHeaderClient initialAuthState={guestAuthState} />
        <Map />
        <Locations />
        <ContactForm />

        <SiteFooter />
      </main>
    </>
  );
}
