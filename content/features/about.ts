import type { AboutContent } from '@/types/about';

export const aboutContent: AboutContent = {
  metadata: {
    title: 'About | Travel & Tours',
    description: 'Learn about Travel & Tours and the team behind your travel experiences.',
  },
  hero: {
    title: 'About Us',
    description:
      'A tropical paradise made for animal lovers replete with monkey caves, dog foundations, and dolphins in the wild.',
    backgroundImageSrc: '/img/pageHeader/1.jpg',
    shapeImageSrc: '/img/hero/1/shape.svg',
  },
  intro: {
    heading:
      'Hello. Our agency has been present for over 29 years in the market. We make the most of all our customers.',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ],
    ctaLabel: 'Learn More',
    ctaHref: '/contact',
  },
  banner: {
    imageSrc: '/img/misc/1.png',
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
