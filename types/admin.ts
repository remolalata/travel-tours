export type AdminPageKey =
  | 'main'
  | 'destinations'
  | 'booking'
  | 'listing'
  | 'profile';

export interface AdminMetadata {
  title: string;
  description: string;
}

export interface AdminNavItem {
  id: number;
  href: string;
  iconClass: string;
  label: string;
}

export interface AdminTopAction {
  id: number;
  iconClass?: string;
  imageSrc?: string;
  label: string;
}

export interface AdminShellContent {
  brandLabel: string;
  searchPlaceholder: string;
  footerPrefix: string;
  navItems: AdminNavItem[];
  topActions: AdminTopAction[];
}

export interface AdminStatCard {
  id: number;
  title: string;
  amount: string;
  today: string;
  iconClass: string;
}

export interface AdminActivityItem {
  id: number;
  iconClass: string;
  message: string;
}

export interface AdminChartPoint {
  name: string;
  value: number;
}

export interface AdminChartTab {
  id: number;
  label: string;
  data: AdminChartPoint[];
}

export interface AdminSectionIntro {
  title: string;
  description: string;
}

export interface AdminMainContent {
  intro: AdminSectionIntro;
  todayLabel: string;
  activitiesTitle: string;
  activitiesCtaLabel: string;
  chartTitle: string;
  statCards: AdminStatCard[];
  activities: AdminActivityItem[];
  chartTabs: AdminChartTab[];
}

export type BookingStatus = 'Approved' | 'Pending' | 'Cancelled' | 'Completed';

export interface AdminBookingContent {
  intro: AdminSectionIntro;
  tabs: BookingStatus[];
}

export interface AdminDestinationsContent {
  intro: AdminSectionIntro;
  addButtonLabel: string;
  addModal: {
    title: string;
    fields: {
      name: string;
      active: string;
    };
    image: {
      uploadLabel: string;
      clearLabel: string;
      previewAlt: string;
    };
    actions: {
      cancel: string;
      save: string;
      saving: string;
    };
    messages: {
      requiredName: string;
      uploadFailedPrefix: string;
      createFailedPrefix: string;
      createSuccess: string;
    };
  };
  editModal: {
    title: string;
    fields: {
      name: string;
      active: string;
    };
    image: {
      uploadLabel: string;
      clearLabel: string;
      previewAlt: string;
    };
    actions: {
      cancel: string;
      save: string;
      saving: string;
    };
    messages: {
      requiredName: string;
      uploadFailedPrefix: string;
      updateFailedPrefix: string;
      updateSuccess: string;
    };
  };
  table: {
    columns: {
      name: string;
      image: string;
      active: string;
      actions: string;
    };
    statusLabels: {
      active: string;
      inactive: string;
    };
    actions: {
      editLabel: string;
      deleteLabel: string;
    };
    messages: {
      loadError: string;
      empty: string;
      deleteFailedPrefix: string;
      deleteSuccess: string;
    };
  };
}

export interface AdminListingItem {
  id: number;
  imageSrc: string;
  location: string;
  title: string;
  rating: number;
  ratingCount: number;
  duration: string;
  price: number;
  fromPrice: number;
}

export interface AdminListingContent {
  intro: AdminSectionIntro;
  addButtonLabel: string;
  pricePrefix: string;
  messages: {
    loading: string;
    loadError: string;
    empty: string;
  };
  summary: {
    showing: string;
    of: string;
    itemSuffix: string;
  };
  createPage: {
    intro: AdminSectionIntro;
    sections: {
      basic: AdminSectionIntro;
      classification: AdminSectionIntro;
      pricing: AdminSectionIntro;
      media: AdminSectionIntro;
      itinerary: AdminSectionIntro;
      inclusions: AdminSectionIntro;
    };
    fields: {
      title: string;
      description: string;
      location: string;
      duration: string;
      destinationId: string;
      tourTypeId: string;
      price: string;
      originalPrice: string;
      imageSrc: string;
      isActive: string;
      isFeatured: string;
      isPopular: string;
      isTopTrending: string;
      itineraryDayNumber: string;
      itineraryTitle: string;
      itineraryContent: string;
      itineraryIcon: string;
      itinerarySummary: string;
      inclusionType: string;
      inclusionOrder: string;
      inclusionContent: string;
    };
    helpers: {
      title: string;
      description: string;
      location: string;
      duration: string;
      destinationId: string;
      tourTypeId: string;
      price: string;
      originalPrice: string;
      imageSrc: string;
      isActive: string;
      isFeatured: string;
      isPopular: string;
      isTopTrending: string;
      itineraryDayNumber: string;
      itineraryTitle: string;
      itineraryContent: string;
      itineraryIcon: string;
      itinerarySummary: string;
      inclusionType: string;
      inclusionOrder: string;
      inclusionContent: string;
    };
    actions: {
      cancel: string;
      create: string;
      addItinerary: string;
      removeItinerary: string;
      addInclusion: string;
      removeInclusion: string;
    };
    messages: {
      selectEmpty: string;
      referencesLoading: string;
      referencesLoadError: string;
    };
    validationMessages: Record<string, string>;
  };
}

export interface AdminGalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface AdminProfileField {
  id: string;
  label: string;
  kind: 'input' | 'textarea';
}

export interface AdminProfileContent {
  intro: AdminSectionIntro;
  profileTitle: string;
  profileFields: AdminProfileField[];
  profileSaveLabel: string;
  savingLabel: string;
  loadingLabel: string;
  photoTitle: string;
  photoHint: string;
  photos: AdminGalleryItem[];
  passwordTitle: string;
  passwordFields: AdminProfileField[];
  passwordSaveLabel: string;
  uploadLabel: string;
  messages: {
    fixHighlightedFields: string;
    sessionExpired: string;
    profileUploadFailedPrefix: string;
    profileTableMissing: string;
    profileSaved: string;
    passwordOldIncorrect: string;
    passwordSaved: string;
  };
  validationMessages: Record<string, string>;
}

export interface AdminPageContentMap {
  main: AdminMainContent;
  destinations: AdminDestinationsContent;
  booking: AdminBookingContent;
  listing: AdminListingContent;
  profile: AdminProfileContent;
}

export interface AdminContent {
  metadata: Record<AdminPageKey, AdminMetadata>;
  shell: AdminShellContent;
  pages: AdminPageContentMap;
}

export interface AdminProfileFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface AdminPasswordFormState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminTourCreateValidationInput {
  title: string;
  description: string;
  location: string;
  duration: string;
  destinationId: string;
  tourTypeId: string;
  price: string;
}
