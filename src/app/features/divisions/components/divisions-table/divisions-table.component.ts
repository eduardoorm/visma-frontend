import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// NgZorro imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { DivisionService } from '../../services/division.service';
import {
  DivisionResponseDto,
  DivisionFilters,
  DivisionSorting
} from '../../models/division.interface';

@Component({
  selector: 'app-divisions-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzDropDownModule,
    NzMenuModule,
    NzIconModule,
    NzCheckboxModule
  ],
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss']
})
export class DivisionsTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() divisions: DivisionResponseDto[] = [];
  @Input() loading = false;
  @Input() selectedColumns: string[] = [];
  @Input() filters: DivisionFilters = {};
  @Input() sorting: DivisionSorting = { field: 'name', direction: 'asc' };
  @Input() allChecked = false;
  @Input() checkedMap: { [key: number]: boolean } = {};

  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<DivisionFilters>();
  @Output() allCheckedChange = new EventEmitter<boolean>();
  @Output() itemCheckedChange = new EventEmitter<{ id: number, checked: boolean }>();

  // Filter properties
  nameSearchValue = '';
  activeFilterColumn: string | null = null;

  // Filter options
  levelOptions = [
    { label: 'Todos los niveles', value: null },
    { label: 'Nivel 1', value: 1 },
    { label: 'Nivel 2', value: 2 },
    { label: 'Nivel 3', value: 3 },
    { label: 'Nivel 4', value: 4 },
    { label: 'Nivel 5', value: 5 }
  ];

  parentDivisions: DivisionResponseDto[] = [];

  constructor(
    private divisionService: DivisionService
  ) {}

  ngOnInit(): void {
    this.loadParentDivisions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga las divisiones padre para el filtro
   */
  loadParentDivisions(): void {
    this.divisionService.getAllDivisions(1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.parentDivisions = response.data;
        },
        error: (error) => {
          console.error('Error loading parent divisions:', error);
        }
      });
  }

  /**
   * Maneja la búsqueda específica por nombre
   */
  onNameSearch(): void {
    const updatedFilters = { ...this.filters, search: this.nameSearchValue || undefined };
    this.filterChange.emit(updatedFilters);
    this.activeFilterColumn = null;
  }

  /**
   * Maneja el ordenamiento de columnas
   */
  onSort(column: string, direction: 'asc' | 'desc' | null): void {
    if (direction) {
      this.sortChange.emit({ column, direction });
    }
  }

  /**
   * Maneja el filtro por nivel
   */
  onLevelFilter(level: number | null): void {
    const updatedFilters = { ...this.filters, level: level || undefined };
    this.filterChange.emit(updatedFilters);
  }

  /**
   * Maneja el filtro por división padre
   */
  onParentFilter(parentId: number | null): void {
    const updatedFilters = { ...this.filters, parentId: parentId || undefined };
    this.filterChange.emit(updatedFilters);
  }

  /**
   * Limpia el filtro de nombre específico
   */
  clearNameFilter(): void {
    this.nameSearchValue = '';
    const updatedFilters = { ...this.filters, search: undefined };
    this.filterChange.emit(updatedFilters);
  }

  /**
   * Maneja el clic en el icono de filtro
   */
  onFilterIconClick(event: MouseEvent, columnName: string): void {
    event.stopPropagation();
    this.activeFilterColumn = columnName;
  }

  /**
   * Maneja la selección de todas las divisiones
   */
  onAllChecked(checked: boolean): void {
    this.allCheckedChange.emit(checked);
  }

  /**
   * Maneja la selección individual de una división
   */
  onItemChecked(id: number, checked: boolean): void {
    this.itemCheckedChange.emit({ id, checked });
  }

  /**
   * Obtiene el nombre de la división padre
   */
  getParentDivisionName(parentId: number | undefined): string {
    if (!parentId) return '-';
    const parent = this.divisions.find(d => d.id === parentId) ||
                   this.parentDivisions.find(d => d.id === parentId);
    return parent?.name || 'Dirección general';
  }

  /**
   * Cuenta las subdivisiones
   */
  getSubdivisionsCount(division: DivisionResponseDto): number {
    if (division.subdivisions?.length) {
      return division.subdivisions.length;
    }
    return this.divisions.filter(d => d.parentId === division.id).length;
  }

  /**
   * Track by function for ngFor performance
   */
  trackByDivision(index: number, division: DivisionResponseDto): number {
    return division.id;
  }
}
