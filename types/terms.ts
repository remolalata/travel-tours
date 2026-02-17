export interface TermsMetadata {
  title: string;
  description: string;
}

export interface TermsBreadcrumbItem {
  id: number;
  label: string;
  href?: string;
}

export interface TermsSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface TermsCategory {
  id: string;
  label: string;
  sections: TermsSection[];
}

export interface TermsPageContent {
  metadata: TermsMetadata;
  pageHeader: {
    breadcrumbs: TermsBreadcrumbItem[];
    subtitle: string;
    title: string;
  };
  tabs: TermsCategory[];
}
