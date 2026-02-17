export interface AboutMetadata {
  title: string;
  description: string;
}

export interface AboutHero {
  title: string;
  description: string;
  backgroundImageSrc: string;
  shapeImageSrc: string;
}

export interface AboutIntro {
  heading: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface AboutBanner {
  imageSrc: string;
  imageAlt: string;
  videoHref: string;
  playAriaLabel: string;
}

export interface AboutTeamMember {
  id: number;
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
}

export interface AboutTeam {
  title: string;
  members: AboutTeamMember[];
}

export interface AboutContent {
  metadata: AboutMetadata;
  hero: AboutHero;
  intro: AboutIntro;
  banner: AboutBanner;
  team: AboutTeam;
}
