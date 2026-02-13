import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tourSingle/PageHeader";
import TourSlider from "@/components/tourSingle/TourSlider";
import SingleOne from "@/components/tourSingle/pages/SingleOne";
import { allTour } from "@/data/tours";

import React from "react";

export const metadata = {
  title: "Boracay Tour Package | Gr8 Escapes Travel & Tours",
  description:
    "Discover Boracay with Gr8 Escapes Travel & Tours. Enjoy curated Boracay tour packages, island activities, and hassle-free booking.",
};

export default async function page(props) {
  const params = await props.params;
  const id = params.id;
  const tour = allTour.find((item) => item.id == id) || allTour[0];

  return (
    <>
      <main>
        <Header1 />
        <PageHeader />

        <SingleOne tour={tour} />
        <TourSlider />
        <FooterOne />
      </main>
    </>
  );
}
