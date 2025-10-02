import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Division,
  CreateDivisionDto,
  UpdateDivisionDto,
  DivisionResponseDto,
  DivisionListResponse,
  DivisionFilters,
  DivisionSorting
} from '../models/division.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private readonly apiUrl = `${environment.apiUrl}/divisions`;
  private readonly useMockData = true; // Cambiar a false cuando el backend esté listo

  // Mock data para testing
  private mockDivisions: DivisionResponseDto[] = [
    {
      id: 1,
      name: 'CE',
      parentId: undefined,
      collaborators: 1,
      level: 1,
      ambassadorName: 'Jordyn Herwitz',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 2,
      name: 'Marketing',
      parentId: 1,
      collaborators: 11,
      level: 2,
      ambassadorName: 'Carla Siphron',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'Gobierno',
      parentId: undefined,
      collaborators: 4,
      level: 2,
      ambassadorName: undefined,
      createdAt: '2023-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 4,
      name: 'Desarrollo Frontend',
      parentId: 3,
      collaborators: 12,
      level: 3,
      ambassadorName: 'Jordyn Herwitz',
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 5,
      name: 'Desarrollo Backend',
      parentId: 3,
      collaborators: 10,
      level: 3,
      ambassadorName: 'Roberto Silva',
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 6,
      name: 'Recursos Humanos',
      parentId: 1,
      collaborators: 6,
      level: 2,
      ambassadorName: 'Carla Siphron',
      createdAt: '2023-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z'
    },
    {
      id: 7,
      name: 'Ventas',
      parentId: 1,
      collaborators: 18,
      level: 2,
      ambassadorName: 'Diego Fernández',
      createdAt: '2023-04-15T00:00:00Z',
      updatedAt: '2024-04-15T00:00:00Z'
    },
    {
      id: 8,
      name: 'QA Testing',
      parentId: 3,
      collaborators: 5,
      level: 3,
      ambassadorName: 'Laura Martínez',
      createdAt: '2023-05-01T00:00:00Z',
      updatedAt: '2024-05-01T00:00:00Z'
    },
    {
      id: 9,
      name: 'DevOps',
      parentId: 3,
      collaborators: 4,
      level: 3,
      ambassadorName: 'Pedro Sánchez',
      createdAt: '2023-05-15T00:00:00Z',
      updatedAt: '2024-05-15T00:00:00Z'
    },
    {
      id: 10,
      name: 'Finanzas',
      parentId: 1,
      collaborators: 7,
      level: 2,
      ambassadorName: 'Isabel Torres',
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      id: 11,
      name: 'Contabilidad',
      parentId: 10,
      collaborators: 3,
      level: 3,
      ambassadorName: 'Miguel Jiménez',
      createdAt: '2023-06-15T00:00:00Z',
      updatedAt: '2024-06-15T00:00:00Z'
    },
    {
      id: 12,
      name: 'Auditoría',
      parentId: 10,
      collaborators: 2,
      level: 3,
      ambassadorName: 'Carmen Ruiz',
      createdAt: '2023-07-01T00:00:00Z',
      updatedAt: '2024-07-01T00:00:00Z'
    },
    {
      id: 13,
      name: 'Ventas Corporativas',
      parentId: 7,
      collaborators: 8,
      level: 3,
      ambassadorName: 'Fernando Vega',
      createdAt: '2023-07-15T00:00:00Z',
      updatedAt: '2024-07-15T00:00:00Z'
    },
    {
      id: 14,
      name: 'Ventas Retail',
      parentId: 7,
      collaborators: 6,
      level: 3,
      ambassadorName: 'Sandra Moreno',
      createdAt: '2023-08-01T00:00:00Z',
      updatedAt: '2024-08-01T00:00:00Z'
    },
    {
      id: 15,
      name: 'Marketing Digital',
      parentId: 6,
      collaborators: 4,
      level: 3,
      ambassadorName: 'Alejandro Castro',
      createdAt: '2023-08-15T00:00:00Z',
      updatedAt: '2024-08-15T00:00:00Z'
    },
    {
      id: 16,
      name: 'SEO/SEM',
      parentId: 15,
      collaborators: 2,
      level: 4,
      ambassadorName: 'Natalia Herrera',
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    },
    {
      id: 17,
      name: 'Redes Sociales',
      parentId: 15,
      collaborators: 3,
      level: 4,
      ambassadorName: 'Jorge Delgado',
      createdAt: '2023-09-15T00:00:00Z',
      updatedAt: '2024-09-15T00:00:00Z'
    },
    {
      id: 18,
      name: 'UX/UI Design',
      parentId: 4,
      collaborators: 4,
      level: 4,
      ambassadorName: 'Lucía Ramírez',
      createdAt: '2023-10-01T00:00:00Z',
      updatedAt: '2024-10-01T00:00:00Z'
    },
    {
      id: 19,
      name: 'Frontend React',
      parentId: 4,
      collaborators: 5,
      level: 4,
      ambassadorName: 'Tomás Guerrero',
      createdAt: '2023-10-15T00:00:00Z',
      updatedAt: '2024-10-15T00:00:00Z'
    },
    {
      id: 20,
      name: 'Frontend Angular',
      parentId: 4,
      collaborators: 3,
      level: 4,
      ambassadorName: 'Elena Vargas',
      createdAt: '2023-11-01T00:00:00Z',
      updatedAt: '2024-11-01T00:00:00Z'
    },
    {
      id: 21,
      name: 'API Development',
      parentId: 5,
      collaborators: 6,
      level: 4,
      ambassadorName: 'Raúl Mendoza',
      createdAt: '2023-11-15T00:00:00Z',
      updatedAt: '2024-11-15T00:00:00Z'
    },
    {
      id: 22,
      name: 'Database Management',
      parentId: 5,
      collaborators: 2,
      level: 4,
      ambassadorName: 'Patricia Rojas',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z'
    },
    {
      id: 23,
      name: 'Mobile Development',
      parentId: 3,
      collaborators: 8,
      level: 3,
      ambassadorName: 'Andrés Peña',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 24,
      name: 'iOS Development',
      parentId: 23,
      collaborators: 4,
      level: 4,
      ambassadorName: 'Gabriela Santos',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 25,
      name: 'Android Development',
      parentId: 23,
      collaborators: 4,
      level: 4,
      ambassadorName: 'Ricardo Flores',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las divisiones con filtros y paginación
   */
  getAllDivisions(
    page: number = 1,
    limit: number = 10,
    filters?: DivisionFilters,
    sorting?: DivisionSorting
  ): Observable<DivisionListResponse> {
    if (this.useMockData) {
      return this.getMockDivisions(page, limit, filters, sorting);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    if (filters?.level !== undefined) {
      params = params.set('level', filters.level.toString());
    }

    if (filters?.parentId !== undefined) {
      params = params.set('parentId', filters.parentId.toString());
    }

    if (filters?.collaboratorsMin !== undefined) {
      params = params.set('collaboratorsMin', filters.collaboratorsMin.toString());
    }

    if (filters?.collaboratorsMax !== undefined) {
      params = params.set('collaboratorsMax', filters.collaboratorsMax.toString());
    }

    if (sorting) {
      params = params.set('sortBy', sorting.field);
      params = params.set('sortOrder', sorting.direction);
    }

    return this.http.get<DivisionListResponse>(this.apiUrl, { params });
  }

  /**
   * Mock para obtener divisiones con paginación y filtros
   */
  private getMockDivisions(
    page: number = 1,
    limit: number = 10,
    filters?: DivisionFilters,
    sorting?: DivisionSorting
  ): Observable<DivisionListResponse> {
    let filteredDivisions = [...this.mockDivisions];

    // Aplicar filtros
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDivisions = filteredDivisions.filter(division =>
        division.name.toLowerCase().includes(searchTerm) ||
        division.ambassadorName?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.level !== undefined) {
      filteredDivisions = filteredDivisions.filter(division => division.level === filters.level);
    }

    if (filters?.parentId !== undefined) {
      filteredDivisions = filteredDivisions.filter(division => division.parentId === filters.parentId);
    }

    if (filters?.collaboratorsMin !== undefined) {
      filteredDivisions = filteredDivisions.filter(division => division.collaborators >= filters.collaboratorsMin!);
    }

    if (filters?.collaboratorsMax !== undefined) {
      filteredDivisions = filteredDivisions.filter(division => division.collaborators <= filters.collaboratorsMax!);
    }

    // Aplicar ordenamiento
    if (sorting) {
      filteredDivisions.sort((a, b) => {
        let valueA: any = a[sorting.field as keyof DivisionResponseDto];
        let valueB: any = b[sorting.field as keyof DivisionResponseDto];

        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (sorting.direction === 'asc') {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    }

    // Aplicar paginación
    const total = filteredDivisions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDivisions = filteredDivisions.slice(startIndex, endIndex);

    const response: DivisionListResponse = {
      data: paginatedDivisions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    // Simular delay de red
    return of(response).pipe(delay(500));
  }

  /**
   * Obtiene una división por ID
   */
  getDivisionById(id: number): Observable<DivisionResponseDto> {
    return this.http.get<DivisionResponseDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene las subdivisiones de una división
   */
  getSubdivisions(divisionId: number): Observable<DivisionResponseDto[]> {
    return this.http.get<DivisionResponseDto[]>(`${this.apiUrl}/${divisionId}/subdivisions`);
  }

  /**
   * Crea una nueva división
   */
  createDivision(division: CreateDivisionDto): Observable<DivisionResponseDto> {
    return this.http.post<DivisionResponseDto>(this.apiUrl, division);
  }

  /**
   * Actualiza una división existente
   */
  updateDivision(id: number, division: UpdateDivisionDto): Observable<DivisionResponseDto> {
    return this.http.put<DivisionResponseDto>(`${this.apiUrl}/${id}`, division);
  }

  /**
   * Elimina una división
   */
  deleteDivision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Exporta divisiones (placeholder para funcionalidad futura)
   */
  exportDivisions(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  /**
   * Importa divisiones (placeholder para funcionalidad futura)
   */
  importDivisions(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/import`, formData);
  }
}
