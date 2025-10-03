export interface Division {
  id: number;
  name: string;
  parentId?: number;
  parent?: Division;
  subdivisions?: Division[];
  collaborators: number;
  level: number;
  ambassadorName?: string;
  createdAt: Date;
  updatedAt: Date;
  
}

export interface CreateDivisionDto {
  name: string;
  parentId?: number;
  collaborators: number;
  level: number;
  ambassadorName?: string;
}

export interface UpdateDivisionDto {
  name?: string;
  parentId?: number;
  collaborators?: number;
  level?: number;
  ambassadorName?: string;
}

export interface DivisionResponseDto {
  id: number;
  name: string;
  parentId?: number;
  parent?: DivisionResponseDto;
  subdivisions?: DivisionResponseDto[];
  collaborators: number;
  level: number;
  ambassadorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DivisionListResponse {
  data: DivisionResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DivisionFilters {
  searchTerm?: string;
  level?: number;
  parentId?: number;
  collaboratorsMin?: number;
  collaboratorsMax?: number;
}

export interface DivisionSorting {
  field: 'name' | 'collaborators' | 'level' | 'createdAt' | 'parentId';
  direction: 'asc' | 'desc';
}

export interface DivisionTableColumn {
  key: string;
  title: string;
  sortable: boolean;
  filterable: boolean;
  width?: string;
}
