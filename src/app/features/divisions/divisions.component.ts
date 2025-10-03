import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DivisionsHeaderComponent } from '../../shared/components/divisions-header/divisions-header.component';
import { TableControlsComponent } from '../../shared/components/table-controls/table-controls.component';
import { DivisionsTableComponent } from './components/divisions-table/divisions-table.component';
import { TableFooterComponent } from '../../shared/components/table-footer/table-footer.component';
import { DivisionFormModalComponent } from './components/division-form-modal/division-form-modal.component';
import { SubdivisionsModalComponent } from './components/subdivisions-modal/subdivisions-modal.component';
import { DivisionService } from './services/division.service';
import {
  DivisionResponseDto,
  DivisionFilters,
  DivisionSorting,
  DivisionTableColumn,
  CreateDivisionDto,
  UpdateDivisionDto
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
    DivisionFormModalComponent,
    SubdivisionsModalComponent
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
        (subdivisionCreated)="onSubdivisionCreated()"
        (editDivision)="onEditDivision($event)"
        (deleteDivision)="onDeleteDivision($event)"
        (viewSubdivisions)="onViewSubdivisions($event)">
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
      <app-division-form-modal
        [(visible)]="isModalVisible"
        [parentDivisions]="allDivisions"
        [editMode]="isEditMode"
        [divisionToEdit]="divisionToEdit"
        (submitForm)="onSubmitDivisionForm($event)">
      </app-division-form-modal>
      <app-subdivisions-modal
        [(visible)]="isSubdivisionsModalVisible"
        [parentDivision]="selectedDivisionForSubdivisions">
      </app-subdivisions-modal>
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
  @ViewChild(DivisionFormModalComponent) modalComponent?: DivisionFormModalComponent;
  divisions: DivisionResponseDto[] = [];
  allDivisions: DivisionResponseDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  isModalVisible = false;
  isEditMode = false;
  divisionToEdit: DivisionResponseDto | null = null;
  isSubdivisionsModalVisible = false;
  selectedDivisionForSubdivisions: DivisionResponseDto | null = null;
  searchValue = '';
  filters: DivisionFilters = {};
  sorting: DivisionSorting = { field: 'name', direction: 'asc' };
  viewMode: 'list' | 'tree' = 'list';
  selectedColumns: string[] = ['division', 'divisionSuperior', 'colaboradores', 'nivel', 'subdivisiones', 'embajadores'];
  allChecked = false;
  indeterminate = false;
  checkedMap: { [key: number]: boolean } = {};
  tableColumns: DivisionTableColumn[] = [
    { key: 'division', title: 'División', sortable: true, filterable: true, width: '250px' },
    { key: 'divisionSuperior', title: 'División superior', sortable: true, filterable: true, width: '200px' },
    { key: 'colaboradores', title: 'Colaboradores', sortable: true, filterable: false, width: '150px' },
    { key: 'nivel', title: 'Nivel', sortable: true, filterable: true, width: '100px' },
    { key: 'subdivisiones', title: 'Subdivisiones', sortable: true, filterable: false, width: '150px' },
    { key: 'embajadores', title: 'Embajadores', sortable: false, filterable: false, width: '200px' }
  ];
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
  tabs: TabConfig[] = [
    { label: 'Divisiones', value: '#', active: true, ariaLabel: 'Ver divisiones' },
    { label: 'Colaboradores', value: '#', active: false, ariaLabel: 'Ver colaboradores' }
  ];
  viewModeLabels = {
    list: 'Listado',
    tree: 'Árbol'
  };
  filterLabels: FilterLabels = {
    division: 'División:',
    divisionSuperior: 'Divisiones superiores:',
    nivel: 'Niveles:',
    searchPlaceholder: 'Buscar división por nombre',
    noDivisionSuperior: 'Sin división superior',
    resetButton: 'Reiniciar',
    applyButton: 'Aplicar'
  };
  levelOptions: LevelOption[] = [
    { label: 'Todos los niveles', value: null },
    { label: 'Nivel 1', value: 1 },
    { label: 'Nivel 2', value: 2 },
    { label: 'Nivel 3', value: 3 },
    { label: 'Nivel 4', value: 4 },
    { label: 'Nivel 5', value: 5 }
  ];
  constructor(
    private divisionService: DivisionService,
    private modal: NzModalService
  ) {}
  ngOnInit(): void {
    this.loadDivisions();
    this.loadAllDivisions();
    this.initCheckedMap();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  initCheckedMap(): void {
    this.checkedMap = {};
    this.allChecked = false;
    this.indeterminate = false;
  }
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
  loadAllDivisions(): void {
    this.divisionService.getAllDivisions(1, 1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.allDivisions = response.data;
      },
      error: (error) => {
        console.error('Error loading all divisions:', error);
      }
    });
  }
  onSearch(value: string): void {
    this.searchValue = value;
    this.filters.searchTerm = value || undefined;
    this.pageIndex = 1;
    this.loadDivisions();
  }
  onSortChange(event: { column: string, direction: 'asc' | 'desc' }): void {
    this.sorting = { field: event.column as any, direction: event.direction };
    this.loadDivisions();
  }
  onFilterChange(filters: DivisionFilters): void {
    this.filters = filters;
    this.pageIndex = 1;
    this.loadDivisions();
  }
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadDivisions();
  }
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadDivisions();
  }
  onViewModeChange(mode: 'list' | 'tree'): void {
    this.viewMode = mode;
    this.loadDivisions();
  }
  toggleColumn(columnKey: string): void {
    const index = this.selectedColumns.indexOf(columnKey);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(columnKey);
    }
  }
  onAllChecked(checked: boolean): void {
    this.divisions.forEach(division => {
      this.checkedMap[division.id] = checked;
    });
    this.refreshCheckedStatus();
  }
  onItemChecked(event: { id: number, checked: boolean }): void {
    this.checkedMap[event.id] = event.checked;
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const divisions = this.divisions;
    const checkedCount = divisions.filter(d => this.checkedMap[d.id]).length;
    this.allChecked = divisions.length > 0 && checkedCount === divisions.length;
    this.indeterminate = checkedCount > 0 && checkedCount < divisions.length;
  }
  createDivision(): void {
    this.isEditMode = false;
    this.divisionToEdit = null;
    this.isModalVisible = true;
  }
  onEditDivision(division: DivisionResponseDto): void {
    this.isEditMode = true;
    this.divisionToEdit = division;
    this.isModalVisible = true;
  }
  onDeleteDivision(division: DivisionResponseDto): void {
    this.modal.confirm({
      nzTitle: '¿Está seguro de eliminar esta división?',
      nzContent: `Se eliminará la división "${division.name}". Esta acción no se puede deshacer.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        return this.divisionService.deleteDivision(division.id)
          .pipe(takeUntil(this.destroy$))
          .toPromise()
          .then(() => {
            this.loadDivisions();
            this.loadAllDivisions();
          })
          .catch((error) => {
            console.error('Error deleting division:', error);
          });
      }
    });
  }
  onViewSubdivisions(division: DivisionResponseDto): void {
    this.selectedDivisionForSubdivisions = division;
    this.isSubdivisionsModalVisible = true;
  }
  onSubmitDivisionForm(divisionData: CreateDivisionDto): void {
    if (this.isEditMode && this.divisionToEdit) {
      const updateData: UpdateDivisionDto = {
        name: divisionData.name,
        parentId: divisionData.parentId,
        level: divisionData.level,
        collaborators: divisionData.collaborators,
        ambassadorName: divisionData.ambassadorName
      };
      this.divisionService.updateDivision(this.divisionToEdit.id, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedDivision) => {
            console.log('Division updated successfully:', updatedDivision);
            this.isModalVisible = false;
            if (this.modalComponent) {
              this.modalComponent.resetForm();
            }
            this.loadDivisions();
            this.loadAllDivisions();
          },
          error: (error) => {
            console.error('Error updating division:', error);
            if (this.modalComponent) {
              this.modalComponent.isLoading = false;
            }
          }
        });
    } else {
      this.divisionService.createDivision(divisionData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newDivision) => {
            this.isModalVisible = false;
            if (this.modalComponent) {
              this.modalComponent.resetForm();
            }
            this.loadDivisions();
            this.loadAllDivisions();
          },
          error: (error) => {
            console.error('Error creating division:', error);
            if (this.modalComponent) {
              this.modalComponent.isLoading = false;
            }
          }
        });
    }
  }
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
  importDivisions(): void {
    console.log('Import divisions');
  }
  onSubdivisionCreated(): void {
    this.loadDivisions();
  }
}
