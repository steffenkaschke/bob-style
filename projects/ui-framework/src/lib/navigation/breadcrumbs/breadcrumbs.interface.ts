export interface Breadcrumb {
  title: string;
  disabled: boolean;
}

export interface BreadcrumbNavButton {
  label: string;
  isVisible: boolean;
}

export interface BreadcrumbNavButtons {
  nextBtn?: BreadcrumbNavButton;
  backBtn?: BreadcrumbNavButton;
}
