import ContactForm from '@/components/contact/sections/ContactForm';
import Locations from '@/components/contact/sections/Locations';
import Map from '@/components/contact/sections/Map';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import { guestAuthState } from '@/utils/auth/guestAuthState';

export default function ContactPage() {
  return (
    <main>
      <SiteHeaderClient initialAuthState={guestAuthState} />
      <Map />
      <Locations />
      <ContactForm />
      <SiteFooter />
    </main>
  );
}
