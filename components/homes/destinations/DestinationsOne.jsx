"use client";

import { destinations } from "@/data/destinations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

function DestinationSlider({ destinations, paginationClass }) {
  return (
    <div
      data-aos="fade-up"
      className="pt-40 sm:pt-20 overflow-hidden js-section-slider aos-init aos-animate"
    >
      <div className="swiper-wrapper">
        <Swiper
          spaceBetween={30}
          className="w-100"
          pagination={{
            el: `.${paginationClass}`,
            clickable: true,
          }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            500: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 6,
            },
            1200: {
              slidesPerView: 8,
            },
          }}
        >
          {destinations.map((elm, i) => (
            <SwiperSlide key={i}>
              <a
                href="#"
                className="text-center featureImage -type-1 -hover-image-scale"
              >
                <div className="mx-auto rounded-full featureImage__image -hover-image-scale__image">
                  <Image
                    width={260}
                    height={260}
                    src={elm.imageSrc}
                    alt={elm.name}
                    className="rounded-full size-130 object-cover"
                  />
                </div>

                <h3 className="mt-20 text-16 featureImage__title fw-500">
                  {elm.name}
                </h3>
                <p className="text-14 featureImage__text">
                  {elm.tourCount}+ Tours
                </p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="justify-center pt-40 md:pt-30 pagination -type-1 js-dest-pagination swiperPagination1">
        <div className={`pagination__button ${paginationClass}`}></div>
      </div>
    </div>
  );
}

export default function DestinationsOne() {
  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div className="justify-between items-end y-gap-10 row">
          <div className="col-auto">
            <h2 data-aos="fade-up" className="text-30 md:text-24">
              Trending Locations
            </h2>
          </div>

          <div data-aos="fade-up" className="col-auto">
            <Link
              href={"/tour-list-1"}
              className="d-flex items-center buttonArrow"
            >
              <span>See all</span>
              <i className="icon-arrow-top-right ml-10 text-16"></i>
            </Link>
          </div>
        </div>

        <DestinationSlider
          destinations={destinations}
          paginationClass="pbutton-trending-locations"
        />
      </div>
    </section>
  );
}
