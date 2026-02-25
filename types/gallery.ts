export interface AppGalleryPickerItem {
  id: string;
  src: string;
  alt?: string;
  file?: File | null;
  isNew?: boolean;
}
