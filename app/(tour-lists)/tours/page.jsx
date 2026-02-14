import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tours/PageHeader";
import TourList1 from "@/components/tours/TourList1";
import React from "react";

export const metadata = {
  title: "Tours | Gr8 Escapes Travel & Tours",
  description: "ViaTour - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <PageHeader />
        <TourList1 />
        <FooterOne />
      </main>
    </>
  );
}
