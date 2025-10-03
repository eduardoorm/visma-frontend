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
  getDivisionById(id: number): Observable<DivisionResponseDto> {
    return this.http.get<DivisionResponseDto>(`${this.apiUrl}/${id}`);
  }
  getSubdivisions(divisionId: number): Observable<DivisionResponseDto[]> {
    return this.http.get<DivisionResponseDto[]>(`${this.apiUrl}/${divisionId}/subdivisions`);
  }
  createDivision(division: CreateDivisionDto): Observable<DivisionResponseDto> {
    return this.http.post<DivisionResponseDto>(this.apiUrl, division);
  }
  updateDivision(id: number, division: UpdateDivisionDto): Observable<DivisionResponseDto> {
    return this.http.put<DivisionResponseDto>(`${this.apiUrl}/${id}`, division);
  }
  deleteDivision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  exportDivisions(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
  importDivisions(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import`, formData);
  }
}
