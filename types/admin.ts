export type AdminPageKey =
  | 'main'
  | 'booking'
  | 'listing'
  | 'addTour'
  | 'favorites'
  | 'messages'
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
  pricePrefix: string;
  cards: AdminListingItem[];
  resultSummary: string;
}

export interface AdminAddTourField {
  id: string;
  label: string;
  kind: 'input' | 'textarea';
}

export interface AdminAddTourTab {
  id: string;
  label: string;
  fields: AdminAddTourField[];
}

export interface AdminGalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface AdminAddTourContent {
  intro: AdminSectionIntro;
  tabs: AdminAddTourTab[];
  galleryTitle: string;
  uploadLabel: string;
  uploadHint: string;
  saveLabel: string;
  gallery: AdminGalleryItem[];
}

export interface AdminFavoritesContent {
  intro: AdminSectionIntro;
  cards: AdminListingItem[];
  resultSummary: string;
  pricePrefix: string;
}

export interface AdminMessageSender {
  id: number;
  image: string;
  badgeColor?: string;
  badgeText?: string;
  name: string;
  role: string;
  time: string;
}

export interface AdminMessageThreadItem {
  id: number;
  senderName: string;
  senderImage: string;
  senderStatus?: string;
  time: string;
  message: string;
  align: 'left' | 'right';
}

export interface AdminMessagesContent {
  intro: AdminSectionIntro;
  searchPlaceholder: string;
  deleteConversationLabel: string;
  sendPlaceholder: string;
  sendButtonLabel: string;
  senders: AdminMessageSender[];
  activeConversation: {
    name: string;
    image: string;
    status: string;
  };
  thread: AdminMessageThreadItem[];
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
  booking: AdminBookingContent;
  listing: AdminListingContent;
  addTour: AdminAddTourContent;
  favorites: AdminFavoritesContent;
  messages: AdminMessagesContent;
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
