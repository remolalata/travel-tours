export interface HelpCenterMetadata {
  title: string;
  description: string;
}

export interface HelpCenterHeroContent {
  title: string;
  description: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  shapeImageSrc: string;
  shapeImageAlt: string;
  searchPlaceholder: string;
  searchButtonAriaLabel: string;
}

export interface HelpTopicItem {
  id: number;
  iconSrc: string;
  title: string;
  content: string;
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
  };
}
