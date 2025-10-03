import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DivisionsHeaderComponent } from '../../shared/components/divisions-header/divisions-header.component';
import { TableControlsComponent } from '../../shared/components/table-controls/table-controls.component';
import { DivisionsTableComponent } from './components/divisions-table/divisions-table.component';
import { TableFooterComponent } from '../../shared/components/table-footer/table-footer.component';
import { CreateDivisionModalComponent } from './components/create-division-modal/create-division-modal.component';

import { DivisionService } from './services/division.service';
import {
  DivisionResponseDto,
  DivisionFilters,
  DivisionSorting,
  DivisionTableColumn
} from './models/division.interface';
import { NavLink, UserInfo, ActionIcon, TabConfig } from '../../shared/models/component-config.interface';
import { FilterLabels, LevelOption } from './models/table-config.interface';

@Component({
  selector: 'app-divisions',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DivisionsHeaderComponent,
    TableControlsComponent,
    DivisionsTableComponent,
    TableFooterComponent,
    CreateDivisionModalComponent
  ],
  template: `
    <div class="divisions-page">
      <app-navbar
        [navLinks]="navLinks"
        [actionIcons]="actionIcons"
        [userInfo]="userInfo">
      </app-navbar>

      <app-divisions-header
        [searchValue]="searchValue"
        [tableColumns]="tableColumns"
        [selectedColumns]="selectedColumns"
        [breadcrumbText]="'Organización'"
        [searchPlaceholder]="'Buscar divisiones por nombre...'"
        [columnDropdownLabel]="'Columnas'"
        [importButtonAriaLabel]="'Importar divisiones'"
        [exportButtonAriaLabel]="'Exportar divisiones'"
        [createButtonAriaLabel]="'Crear nueva división'"
        (searchChange)="onSearch($event)"
        (columnToggle)="toggleColumn($event)"
        (importClick)="importDivisions()"
        (exportClick)="exportDivisions()"
        (createClick)="createDivision()">
      </app-divisions-header>

      <app-table-controls
        [viewMode]="viewMode"
        [tabs]="tabs"
        [viewModeLabels]="viewModeLabels"
        (viewModeChange)="onViewModeChange($event)">
      </app-table-controls>

      <app-divisions-table
        [divisions]="divisions"
        [loading]="loading"
        [selectedColumns]="selectedColumns"
        [filters]="filters"
        [sorting]="sorting"
        [allChecked]="allChecked"
        [checkedMap]="checkedMap"
        [columnLabels]="tableColumns"
        [filterLabels]="filterLabels"
        [levelOptions]="levelOptions"
        [defaultParentName]="'Dirección general'"
        [emptyValuePlaceholder]="'-'"
        (sortChange)="onSortChange($event)"
        (filterChange)="onFilterChange($event)"
        (allCheckedChange)="onAllChecked($event)"
        (itemCheckedChange)="onItemChecked($event)"
        (subdivisionCreated)="onSubdivisionCreated()">
      </app-divisions-table>

      <app-table-footer
        [total]="total"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        [totalLabel]="'Total colaboradores:'"
        [pageSizeLabel]="'/ página'"
        [pageSizeOptions]="[10, 20, 50, 100]"
        (pageSizeChange)="onPageSizeChange($event)"
        (pageIndexChange)="onPageChange($event)">
      </app-table-footer>

      <app-create-division-modal
        [(visible)]="isModalVisible"
        [parentDivision]="null"
        (divisionCreated)="onDivisionCreated()">
      </app-create-division-modal>
    </div>
  `,
  styles: [`
    .divisions-page {
      min-height: 100vh;
      background-color: #F9F9F9;
    }
  `]
})
export class DivisionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  divisions: DivisionResponseDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  // Search and filter properties
  searchValue = '';
  filters: DivisionFilters = {};
  sorting: DivisionSorting = { field: 'name', direction: 'asc' };

  // Table configuration
  viewMode: 'list' | 'tree' = 'list';
  selectedColumns: string[] = ['division', 'divisionSuperior', 'colaboradores', 'nivel', 'subdivisiones', 'embajadores'];

  // Selection properties
  allChecked = false;
  indeterminate = false;
  checkedMap: { [key: number]: boolean } = {};

  // Modal properties
  isModalVisible = false;

  // Table columns configuration
  tableColumns: DivisionTableColumn[] = [
    { key: 'division', title: 'División', sortable: true, filterable: true, width: '250px' },
    { key: 'divisionSuperior', title: 'División superior', sortable: true, filterable: true, width: '200px' },
    { key: 'colaboradores', title: 'Colaboradores', sortable: true, filterable: false, width: '150px' },
    { key: 'nivel', title: 'Nivel', sortable: true, filterable: true, width: '100px' },
    { key: 'subdivisiones', title: 'Subdivisiones', sortable: true, filterable: false, width: '150px' },
    { key: 'embajadores', title: 'Embajadores', sortable: false, filterable: false, width: '200px' }
  ];

  // Navbar configuration
  navLinks: NavLink[] = [
    { label: 'Dashboard', href: '#', active: false, ariaLabel: 'Ir al Dashboard' },
    { label: 'Organización', href: '#', active: true, ariaLabel: 'Ir a Organización' },
    { label: 'Modelos', href: '#', hasDropdown: true, ariaLabel: 'Ver Modelos' },
    { label: 'Seguimiento', href: '#', hasDropdown: true, ariaLabel: 'Ver Seguimiento' }
  ];

  actionIcons: ActionIcon[] = [
    { icon: 'mail', ariaLabel: 'Mensajes' },
    { icon: 'question-circle', ariaLabel: 'Ayuda' },
    { icon: 'bell', ariaLabel: 'Notificaciones', badge: 1 }
  ];

  userInfo: UserInfo = {
    name: 'Administrador',
    avatarUrl: 'assets/images/profile-image.png',
    ariaLabel: 'Perfil de usuario'
  };

  // Table controls configuration
  tabs: TabConfig[] = [
    { label: 'Divisiones', value: '#', active: true, ariaLabel: 'Ver divisiones' },
    { label: 'Colaboradores', value: '#', active: false, ariaLabel: 'Ver colaboradores' }
  ];

  viewModeLabels = {
    list: 'Listado',
    tree: 'Árbol'
  };

  // Filter labels configuration
  filterLabels: FilterLabels = {
    division: 'División:',
    divisionSuperior: 'Divisiones superiores:',
    nivel: 'Niveles:',
    searchPlaceholder: 'Buscar división por nombre',
    noDivisionSuperior: 'Sin división superior',
    resetButton: 'Reiniciar',
    applyButton: 'Aplicar'
  };

  // Level options configuration
  levelOptions: LevelOption[] = [
    { label: 'Todos los niveles', value: null },
    { label: 'Nivel 1', value: 1 },
    { label: 'Nivel 2', value: 2 },
    { label: 'Nivel 3', value: 3 },
    { label: 'Nivel 4', value: 4 },
    { label: 'Nivel 5', value: 5 }
  ];

  constructor(private divisionService: DivisionService) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.initCheckedMap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the checked map
   */
  initCheckedMap(): void {
    this.checkedMap = {};
    this.allChecked = false;
    this.indeterminate = false;
  }

  /**
   * Load divisions with filters and pagination
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
   * Handle search
   */
  onSearch(value: string): void {
    this.searchValue = value;
    this.filters.searchTerm = value || undefined;
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Handle sort change
   */
  onSortChange(event: { column: string, direction: 'asc' | 'desc' }): void {
    this.sorting = { field: event.column as any, direction: event.direction };
    this.loadDivisions();
  }

  /**
   * Handle filter change
   */
  onFilterChange(filters: DivisionFilters): void {
    this.filters = filters;
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadDivisions();
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadDivisions();
  }

  /**
   * Handle view mode change
   */
  onViewModeChange(mode: 'list' | 'tree'): void {
    this.viewMode = mode;
    this.loadDivisions();
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
   * Handle select all
   */
  onAllChecked(checked: boolean): void {
    this.divisions.forEach(division => {
      this.checkedMap[division.id] = checked;
    });
    this.refreshCheckedStatus();
  }

  /**
   * Handle individual item check
   */
  onItemChecked(event: { id: number, checked: boolean }): void {
    this.checkedMap[event.id] = event.checked;
    this.refreshCheckedStatus();
  }

  /**
   * Refresh checked status
   */
  refreshCheckedStatus(): void {
    const divisions = this.divisions;
    const checkedCount = divisions.filter(d => this.checkedMap[d.id]).length;
    this.allChecked = divisions.length > 0 && checkedCount === divisions.length;
    this.indeterminate = checkedCount > 0 && checkedCount < divisions.length;
  }

  /**
   * Create new division
   */
  createDivision(): void {
    this.isModalVisible = true;
  }

  /**
   * Handle division creation from modal
   */
  onDivisionCreated(): void {
    // Reload divisions to show the new one
    this.loadDivisions();
  }

  /**
   * Export divisions
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
   * Import divisions
   */
  importDivisions(): void {
    // TODO: Open modal to import file
    console.log('Import divisions');
  }

  /**
   * Handle subdivision created event
   */
  onSubdivisionCreated(): void {
    // Reload divisions to show the new subdivision
    this.loadDivisions();
  }
}
