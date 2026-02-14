import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import ContactForm from '@/components/pages/contact/ContactForm';
import Locations from '@/components/pages/contact/Locations';
import Map from '@/components/pages/contact/Map';
import React from 'react';

export const metadata = {
  title: 'Contact || ViaTour - Travel & Tour React NextJS Template',
  description: 'ViaTour - Travel & Tour React NextJS Template',
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
