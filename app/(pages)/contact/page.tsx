import ContactForm from '@/components/contact/sections/ContactForm';
import Locations from '@/components/contact/sections/Locations';
import Map from '@/components/contact/sections/Map';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { contactPageContent } from '@/content/features/contact';

export const metadata = {
  title: contactPageContent.metadata.title,
  description: contactPageContent.metadata.description,
};

export default function page() {
  return (
    <>
      <main>
        <SiteHeader />
        <Map />
        <Locations />
        <ContactForm />

        <SiteFooter />
      </main>
    </>
  );
}
