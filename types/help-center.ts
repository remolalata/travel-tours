export interface HelpCenterMetadata {
  title: string;
  description: string;
}

export interface HelpCenterHeroContent {
  title: string;
  description: string;
  backgroundImageSrc: string;
  shapeImageSrc: string;
  searchPlaceholder: string;
}

export interface HelpTopicItem {
  id: number;
  iconSrc: string;
  title: string;
  content: string;
}

export interface HelpFaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface HelpCenterPageContent {
  metadata: HelpCenterMetadata;
  hero: HelpCenterHeroContent;
  topics: {
    title: string;
    items: HelpTopicItem[];
  };
  faq: {
    title: string;
    items: HelpFaqItem[];
  };
}
