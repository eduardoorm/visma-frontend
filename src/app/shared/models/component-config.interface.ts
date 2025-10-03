/**
 * Shared interfaces for component configurations
 * Used to remove hardcoded text and make components reusable
 */

/**
 * Navigation link configuration
 */
export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
  hasDropdown?: boolean;
  ariaLabel?: string;
}

/**
 * User information configuration
 */
export interface UserInfo {
  name: string;
  avatarUrl?: string;
  ariaLabel?: string;
}

/**
 * Action icon configuration
 */
export interface ActionIcon {
  icon: string;
  ariaLabel: string;
  badge?: number;
  onClick?: () => void;
}

/**
 * Tab configuration
 */
export interface TabConfig {
  label: string;
  value: string;
  active?: boolean;
  ariaLabel?: string;
}

/**
 * Action button configuration
 */
export interface ActionButton {
  label?: string;
  icon?: string;
  ariaLabel: string;
  type?: 'default' | 'primary';
  onClick?: () => void;
}

/**
 * Table footer configuration
 */
export interface TableFooterConfig {
  totalLabel: string;
  pageSizeLabel: string;
  pageSizeOptions: number[];
}

/**
 * Header configuration for divisions/entity headers
 */
export interface EntityHeaderConfig {
  breadcrumbText: string;
  searchPlaceholder: string;
  columnDropdownLabel: string;
  importButtonAriaLabel: string;
  exportButtonAriaLabel: string;
  createButtonAriaLabel: string;
}

/**
 * Table controls configuration
 */
export interface TableControlsConfig {
  tabs: TabConfig[];
  viewModeLabels: {
    list: string;
    tree: string;
  };
}
