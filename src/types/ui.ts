
export interface NavItemType {
  name: string;
  link: string;
  subitems?: NavItemType[];
}

export interface ImageType {
  src: string;
  alt: string;
}