'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { homeContent } from '@/content/features/home';

export default function WhyChooseUsFeatures() {
  const shouldReduceMotion = useReducedMotion();
  const baseDuration = shouldReduceMotion ? 0 : 0.4;
  const viewport = { once: true, amount: 0.25 as const };
  const { whyChooseUs } = homeContent;

  return (
    <section className='layout-pt-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-auto'>
            <motion.h2
              className='text-30 md:text-24'
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: baseDuration }}
            >
              {whyChooseUs.title}
            </motion.h2>
          </div>
        </div>

        <motion.div
          className='row md:x-gap-20 pt-40 sm:pt-20 mobile-css-slider -w-280'
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          {whyChooseUs.features.map((feature) => (
            <div key={feature.id} className='col-lg-3 col-sm-6'>
              <div className='featureIcon -type-1 pr-40 md:pr-0'>
                <div className='featureIcon__icon'>
                  <Image width={60} height={60} src={feature.iconSrc} alt='icon' />
                </div>

                <h3 className='featureIcon__title text-18 fw-500 mt-30'>{feature.title}</h3>
                <p className='featureIcon__text mt-10'>{feature.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
