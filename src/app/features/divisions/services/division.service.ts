import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreateDivisionDto,
  UpdateDivisionDto,
  DivisionResponseDto,
  DivisionListResponse,
  DivisionFilters,
  DivisionSorting
} from '../models/division.interface';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private readonly apiUrl = `${environment.apiUrl}/divisions`;

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

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
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
    return this.http.get<DivisionListResponse>(`${this.apiUrl}`, { params })
  }

  /**
   * Mock para obtener divisiones con paginación y filtros
   */

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
    if (this.useMockData) {
      // Generate a new ID
      const newId = Math.max(...this.mockDivisions.map(d => d.id), 0) + 1;
      const now = new Date().toISOString();
      
      const newDivision: DivisionResponseDto = {
        id: newId,
        name: division.name,
        parentId: division.parentId,
        collaborators: division.collaborators,
        level: division.level,
        ambassadorName: division.ambassadorName,
        createdAt: now,
        updatedAt: now
      };
      
      // Add to mock data
      this.mockDivisions.push(newDivision);
      
      // Return with delay to simulate API call
      return of(newDivision).pipe(delay(500));
    }
    
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
