import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// NgZorro imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

import { DivisionService } from '../../services/division.service';
import {
  DivisionResponseDto,
  DivisionFilters,
  DivisionSorting,
  DivisionTableColumn
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
    NzSelectModule,
    NzPaginationModule,
    NzDropDownModule,
    NzMenuModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzMessageModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzAvatarModule,
    NzBadgeModule
  ],
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss']
})
export class DivisionsTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  divisions: DivisionResponseDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  // Filter and search properties
  searchValue = '';
  nameSearchValue = ''; // Para búsqueda específica por nombre
  filters: DivisionFilters = {};
  sorting: DivisionSorting = { field: 'name', direction: 'asc' };
  showFilters = false;

  // Selection and check properties
  allChecked = false;
  indeterminate = false;
  checkedMap: { [key: number]: boolean } = {};
  activeFilterColumn: string | null = null;

  // Table configuration
  viewMode: 'list' | 'tree' = 'list';
  selectedColumns: string[] = ['division', 'divisionSuperior', 'colaboradores', 'nivel', 'subdivisiones', 'embajadores'];

  // Table columns configuration matching Figma design
  tableColumns: DivisionTableColumn[] = [
    { key: 'division', title: 'División', sortable: true, filterable: true, width: '250px' },
    { key: 'divisionSuperior', title: 'División superior', sortable: true, filterable: true, width: '200px' },
    { key: 'colaboradores', title: 'Colaboradores', sortable: true, filterable: false, width: '150px' },
    { key: 'nivel', title: 'Nivel', sortable: true, filterable: true, width: '100px' },
    { key: 'subdivisiones', title: 'Subdivisiones', sortable: true, filterable: false, width: '150px' },
    { key: 'embajadores', title: 'Embajadores', sortable: false, filterable: false, width: '200px' }
  ];

  // Filter options for dropdowns
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
    this.loadDivisions();
    this.loadParentDivisions();
    this.initCheckedMap();
  }

  /**
   * Inicializa el mapa de selección
   */
  initCheckedMap(): void {
    this.checkedMap = {};
    this.allChecked = false;
    this.indeterminate = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga las divisiones con filtros y paginación
   */
  loadDivisions(): void {
    this.loading = true;
    this.initCheckedMap();

    this.divisionService.getAllDivisions(
      this.pageIndex,
      this.pageSize,
      this.filters,
      this.sorting
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.divisions = response.data;
        this.total = response.meta.total;
        this.loading = false;
        this.refreshCheckedStatus();
      },
      error: (error) => {
        console.error('Error loading divisions:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Carga las divisiones padre para el filtro
   */
  loadParentDivisions(): void {
    // Cargar todas las divisiones para poder usarlas como referencia padre
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
   * Maneja la búsqueda de divisiones
   */
  onSearch(value: string): void {
    this.filters.search = value || undefined;
    this.nameSearchValue = value || ''; // Sincroniza los valores de búsqueda
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Maneja la búsqueda específica por nombre
   */
  onNameSearch(): void {
    this.filters.search = this.nameSearchValue || undefined;
    this.pageIndex = 1;
    this.loadDivisions();
    // Cerrar el filtro después de buscar
    this.activeFilterColumn = null;
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadDivisions();
  }

  /**
   * Maneja el cambio de tamaño de página
   */
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Maneja el ordenamiento de columnas
   */
  onSort(column: string, direction: 'asc' | 'desc' | null): void {
    if (direction) {
      this.sorting = { field: column as any, direction };
    } else {
      this.sorting = { field: 'name', direction: 'asc' };
    }
    this.loadDivisions();
  }

  /**
   * Alterna entre vista de lista y árbol
   */
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'tree' : 'list';
    // Recargar datos según el modo de vista
    this.loadDivisions();
  }

  /**
   * Crea una nueva división
   */
  createDivision(): void {
    // TODO: Abrir modal para crear división
    console.log('Create division');
  }

  /**
   * Edita una división existente
   */
  editDivision(division: DivisionResponseDto): void {
    // TODO: Abrir modal para editar división
    console.log('Edit division:', division);
  }

  /**
   * Elimina una división
   */
  deleteDivision(division: DivisionResponseDto): void {
    // TODO: Confirmar y eliminar división
    console.log('Delete division:', division);
  }

  /**
   * Exporta las divisiones
   */
  exportDivisions(): void {
    this.divisionService.exportDivisions('csv')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'divisiones.csv';
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error exporting divisions:', error);
        }
      });
  }

  /**
   * Importa divisiones
   */
  importDivisions(): void {
    // TODO: Abrir modal para importar archivo
    console.log('Import divisions');
  }

  /**
   * Maneja el filtro por nivel
   */
  onLevelFilter(level: number | null): void {
    this.filters.level = level || undefined;
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Maneja el filtro por división padre
   */
  onParentFilter(parentId: number | null): void {
    this.filters.parentId = parentId || undefined;
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.filters = {};
    this.searchValue = '';
    this.nameSearchValue = '';
    this.pageIndex = 1;
    this.loadDivisions();
    this.activeFilterColumn = null;
  }

  /**
   * Limpia el filtro de búsqueda
   */
  clearSearch(): void {
    this.filters.search = undefined;
    this.searchValue = '';
    this.nameSearchValue = '';
    this.pageIndex = 1;
    this.loadDivisions();
  }

  // Eliminado el método toggleFilters que ya no se utiliza

  /**
   * Muestra u oculta filtros para una columna específica
   */
  toggleFilterByColumn(columnName: string): void {
    if (this.activeFilterColumn === columnName) {
      this.activeFilterColumn = null;
    } else {
      this.activeFilterColumn = columnName;
      this.showFilters = true;
    }
  }

  /**
   * Maneja el clic en el icono de filtro
   */
  onFilterIconClick(event: MouseEvent, columnName: string): void {
    // Prevenir que el evento se propague para evitar que el dropdown se cierre inmediatamente
    event.stopPropagation();
    this.activeFilterColumn = columnName;
  }

  /**
   * Limpia el filtro de nombre específico
   */
  clearNameFilter(): void {
    this.nameSearchValue = '';
    this.filters.search = undefined;
    this.loadDivisions();
  }

  /**
   * Maneja la selección de todas las divisiones
   */
  onAllChecked(checked: boolean): void {
    this.divisions.forEach(division => {
      this.checkedMap[division.id] = checked;
    });
    this.refreshCheckedStatus();
  }

  /**
   * Maneja la selección individual de una división
   */
  onItemChecked(id: number, checked: boolean): void {
    this.checkedMap[id] = checked;
    this.refreshCheckedStatus();
  }

  /**
   * Actualiza el estado de selección global
   */
  refreshCheckedStatus(): void {
    const divisions = this.divisions;
    const checkedCount = divisions.filter(d => this.checkedMap[d.id]).length;
    this.allChecked = divisions.length > 0 && checkedCount === divisions.length;
    this.indeterminate = checkedCount > 0 && checkedCount < divisions.length;
  }

  /**
   * Obtiene el nombre de la división padre
   */
  getParentDivisionName(parentId: number | undefined): string {
    if (!parentId) return '-';
    // Buscar en las divisiones actuales primero
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
    // Si no hay subdivisiones precargadas, contar desde los datos actuales
    return this.divisions.filter(d => d.parentId === division.id).length;
  }

  /**
   * Toggle column visibility
   */
  toggleColumn(columnKey: string): void {
    const index = this.selectedColumns.indexOf(columnKey);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(columnKey);
    }
  }

  /**
   * Track by function for ngFor performance
   */
  trackByDivision(index: number, division: DivisionResponseDto): number {
    return division.id;
  }
}
