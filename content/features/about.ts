import type { AboutContent } from '@/types/about';

export const aboutContent: AboutContent = {
  metadata: {
    title: 'About | Travel & Tours',
    description: 'Learn about Travel & Tours and the team behind your travel experiences.',
  },
  hero: {
    title: 'About Us',
    description: '',
    backgroundImageSrc: '/img/hero.webp',
    backgroundImageAlt: 'About page header background',
    shapeImageSrc: '/img/hero/1/shape.svg',
    shapeImageAlt: 'About page header shape',
  },
  intro: {
    heading:
      'Travel & Tours helps travelers plan smooth, memorable trips with clear guidance, curated packages, and reliable support from inquiry to return.',
    paragraphs: [
      'We focus on practical travel planning, transparent inclusions, and destination experiences that fit real schedules and budgets. Whether you are booking a family getaway, a couple trip, or a group adventure, our team works to make every step easy to understand.',
      'From trip recommendations and quote requests to booking assistance and pre-travel coordination, we aim to deliver a friendly and dependable experience that lets you spend less time worrying about logistics and more time enjoying the journey.',
    ],
    ctaLabel: 'Learn More',
    ctaHref: '/contact',
  },
  banner: {
    imageSrc: '/img/hero.webp',
    imageAlt: 'About media banner',
    videoHref: 'https://www.youtube.com/watch?v=ANYfx4-jyqY',
    playAriaLabel: 'Play about video',
  },
  team: {
    title: 'Meet The Team',
    members: [
      {
        id: 1,
        name: 'Wade Warren',
        role: 'Founder & Travel Director',
        imageSrc: '/img/team/1/1.jpg',
        imageAlt: 'Wade Warren',
      },
      {
        id: 2,
        name: 'Savannah Nguyen',
        role: 'Operations Manager',
        imageSrc: '/img/team/1/2.jpg',
        imageAlt: 'Savannah Nguyen',
      },
      {
        id: 3,
        name: 'Jenny Wilson',
        role: 'Tour Specialist',
        imageSrc: '/img/team/1/3.jpg',
        imageAlt: 'Jenny Wilson',
      },
      {
        id: 4,
        name: 'Cameron Williamson',
        role: 'Customer Experience Lead',
        imageSrc: '/img/team/1/4.jpg',
        imageAlt: 'Cameron Williamson',
      },
      {
        id: 5,
        name: 'Leslie Alexander',
        role: 'Partnerships Manager',
        imageSrc: '/img/team/1/5.jpg',
        imageAlt: 'Leslie Alexander',
      },
    ],
  },
};
