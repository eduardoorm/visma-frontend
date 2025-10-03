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
  DivisionSorting,
  DivisionTableColumn
} from '../../models/division.interface';
import { FilterLabels, LevelOption } from '../../models/table-config.interface';
import { FilterPipe } from '../../pipes/filter.pipe';
import { CreateDivisionModalComponent } from '../create-division-modal/create-division-modal.component';

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
    NzCheckboxModule,
    FilterPipe,
    CreateDivisionModalComponent
  ],
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss']
})
export class DivisionsTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  parentSearchValue: string = '';
  divisionFilterVisible = false;
  parentFilterVisible = false;

  // Modal and form properties
  isModalVisible = false;
  selectedParentDivision: DivisionResponseDto | null = null;

  @Input() divisions: DivisionResponseDto[] = [];
  @Input() loading = false;
  @Input() selectedColumns: string[] = [];
  @Input() filters: DivisionFilters = {};
  @Input() sorting: DivisionSorting = { field: 'name', direction: 'asc' };
  @Input() allChecked = false;
  @Input() checkedMap: { [key: number]: boolean } = {};
  @Input() columnLabels: DivisionTableColumn[] = [];
  @Input() filterLabels: FilterLabels = {
    division: 'División:',
    divisionSuperior: 'Divisiones superiores:',
    nivel: 'Niveles:',
    searchPlaceholder: 'Buscar división por nombre',
    noDivisionSuperior: 'Sin división superior',
    resetButton: 'Reiniciar',
    applyButton: 'Aplicar'
  };
  @Input() levelOptions: LevelOption[] = [
    { label: 'Todos los niveles', value: null },
    { label: 'Nivel 1', value: 1 },
    { label: 'Nivel 2', value: 2 },
    { label: 'Nivel 3', value: 3 },
    { label: 'Nivel 4', value: 4 },
    { label: 'Nivel 5', value: 5 }
  ];
  @Input() defaultParentName = 'Dirección general';
  @Input() emptyValuePlaceholder = '-';

  @Output() sortChange = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<DivisionFilters>();
  @Output() allCheckedChange = new EventEmitter<boolean>();
  @Output() itemCheckedChange = new EventEmitter<{ id: number, checked: boolean }>();
  @Output() subdivisionCreated = new EventEmitter<void>();

  // Filter properties
  nameSearchValue = '';
  activeFilterColumn: string | null = null;

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
    const updatedFilters = { ...this.filters, searchTerm: this.nameSearchValue || undefined };
    this.filterChange.emit(updatedFilters);
    this.activeFilterColumn = null;
  }

  /**
   * Maneja el filtro por nombre de división seleccionada
   */
  onDivisionFilter(divisionName: string): void {
    const updatedFilters = { ...this.filters, searchTerm: divisionName };
    this.filterChange.emit(updatedFilters);
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
    console.log(updatedFilters);
    this.filterChange.emit(updatedFilters);
  }

  // Limpia solo el filtro de búsqueda de división
  clearNameFilter(): void {
    this.nameSearchValue = '';
    const updatedFilters = { ...this.filters, searchTerm: undefined };
    this.filterChange.emit(updatedFilters);
  }

  // Limpia solo el filtro de división superior
  clearParentFilter(): void {
    this.parentSearchValue = '';
    const updatedFilters = { ...this.filters, parentId: undefined };
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
    if (!parentId) return this.emptyValuePlaceholder;
    const parent = this.divisions.find(d => d.id === parentId) ||
                   this.parentDivisions.find(d => d.id === parentId);
    return parent?.name || this.defaultParentName;
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
   * Obtiene el label de una columna por su key
   */
  getColumnLabel(columnKey: string): string {
    const column = this.columnLabels.find(c => c.key === columnKey);
    return column?.title || columnKey;
  }

  /**
   * Track by function for ngFor performance
   */
  trackByDivision(index: number, division: DivisionResponseDto): number {
    return division.id;
  }

  /**
   * Abre el modal para crear división
   */
  onAddSubdivision(parentDivision: DivisionResponseDto): void {
    this.selectedParentDivision = parentDivision;
    this.isModalVisible = true;
  }

  /**
   * Maneja la creación de la división desde el modal
   */
  onDivisionCreated(): void {
    // Emitir evento para recargar la tabla
    this.subdivisionCreated.emit();
  }
}
