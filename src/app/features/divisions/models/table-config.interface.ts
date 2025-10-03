/**
 * Configuration interfaces for DivisionsTable component
 */

export interface TableColumnLabels {
  [key: string]: string;
}

export interface FilterLabels {
  division: string;
  divisionSuperior: string;
  nivel: string;
  searchPlaceholder: string;
  noDivisionSuperior: string;
  resetButton: string;
  applyButton: string;
}

export interface LevelOption {
  label: string;
  value: number | null;
}
