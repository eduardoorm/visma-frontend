import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
export class DivisionsTableComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();
  parentSearchValue: string = '';
  divisionFilterVisible = false;
  parentFilterVisible = false;
  isModalVisible = false;
  selectedParentDivision: DivisionResponseDto | null = null;
  subdivisionsCountCache: Map<number, number> = new Map();
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
  @Output() editDivision = new EventEmitter<DivisionResponseDto>();
  @Output() deleteDivision = new EventEmitter<DivisionResponseDto>();
  @Output() viewSubdivisions = new EventEmitter<DivisionResponseDto>();
  nameSearchValue = '';
  activeFilterColumn: string | null = null;
  parentDivisions: DivisionResponseDto[] = [];
  constructor(
    private divisionService: DivisionService
  ) {}
  ngOnInit(): void {
    this.loadParentDivisions();
    this.loadSubdivisionsCounts();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['divisions'] && !changes['divisions'].firstChange) {
      this.loadSubdivisionsCounts();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadSubdivisionsCounts(): void {
    this.divisions.forEach(division => {
      this.divisionService.getSubdivisions(division.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (subdivisions) => {
            this.subdivisionsCountCache.set(division.id, subdivisions.length);
          },
          error: (error) => {
            console.error(`Error loading subdivisions count for division ${division.id}:`, error);
            this.subdivisionsCountCache.set(division.id, 0);
          }
        });
    });
  }
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
  onNameSearch(): void {
    const updatedFilters = { ...this.filters, searchTerm: this.nameSearchValue || undefined };
    this.filterChange.emit(updatedFilters);
    this.activeFilterColumn = null;
  }
  onDivisionFilter(divisionName: string): void {
    const updatedFilters = { ...this.filters, searchTerm: divisionName };
    this.filterChange.emit(updatedFilters);
  }
  onSort(column: string, direction: 'asc' | 'desc' | null): void {
    if (direction) {
      this.sortChange.emit({ column, direction });
    }
  }
  onLevelFilter(level: number | null): void {
    const updatedFilters = { ...this.filters, level: level || undefined };
    this.filterChange.emit(updatedFilters);
  }
  onParentFilter(parentId: number | null): void {
    const updatedFilters = { ...this.filters, parentId: parentId || undefined };
    this.filterChange.emit(updatedFilters);
  }
  clearNameFilter(): void {
    this.nameSearchValue = '';
    const updatedFilters = { ...this.filters, searchTerm: undefined };
    this.filterChange.emit(updatedFilters);
  }
  clearParentFilter(): void {
    this.parentSearchValue = '';
    const updatedFilters = { ...this.filters, parentId: undefined };
    this.filterChange.emit(updatedFilters);
  }
  onFilterIconClick(event: MouseEvent, columnName: string): void {
    event.stopPropagation();
    this.activeFilterColumn = columnName;
  }
  onAllChecked(checked: boolean): void {
    this.allCheckedChange.emit(checked);
  }
  onItemChecked(id: number, checked: boolean): void {
    this.itemCheckedChange.emit({ id, checked });
  }
  getParentDivisionName(parentId: number | undefined): string {
    if (!parentId) return this.emptyValuePlaceholder;
    const parent = this.divisions.find(d => d.id === parentId) ||
                   this.parentDivisions.find(d => d.id === parentId);
    return parent?.name || this.defaultParentName;
  }
  getSubdivisionsCount(division: DivisionResponseDto): number {
    const cachedCount = this.subdivisionsCountCache.get(division.id);
    if (cachedCount !== undefined) {
      return cachedCount;
    }
    if (division.subdivisions?.length) {
      return division.subdivisions.length;
    }
    return this.divisions.filter(d => d.parentId === division.id).length;
  }
  getColumnLabel(columnKey: string): string {
    const column = this.columnLabels.find(c => c.key === columnKey);
    return column?.title || columnKey;
  }
  trackByDivision(index: number, division: DivisionResponseDto): number {
    return division.id;
  }
  onAddSubdivision(parentDivision: DivisionResponseDto): void {
    this.selectedParentDivision = parentDivision;
    this.isModalVisible = true;
  }
  onDivisionCreated(): void {
    if (this.selectedParentDivision) {
      this.divisionService.getSubdivisions(this.selectedParentDivision.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (subdivisions) => {
            this.subdivisionsCountCache.set(this.selectedParentDivision!.id, subdivisions.length);
          },
          error: (error) => {
            console.error('Error updating subdivisions count:', error);
          }
        });
    }
    this.subdivisionCreated.emit();
  }
  onEditDivision(division: DivisionResponseDto, event: Event): void {
    event.stopPropagation();
    this.editDivision.emit(division);
  }
  onDeleteDivision(division: DivisionResponseDto, event: Event): void {
    event.stopPropagation();
    this.deleteDivision.emit(division);
  }
  onViewSubdivisions(division: DivisionResponseDto, event: Event): void {
    event.stopPropagation();
    const count = this.getSubdivisionsCount(division);
    if (count > 0) {
      this.viewSubdivisions.emit(division);
    }
  }
}
