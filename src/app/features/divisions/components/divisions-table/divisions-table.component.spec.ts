import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DivisionsTableComponent } from './divisions-table.component';
import { DivisionService } from '../../services/division.service';
import { of } from 'rxjs';

describe('DivisionsTableComponent', () => {
  let component: DivisionsTableComponent;
  let fixture: ComponentFixture<DivisionsTableComponent>;
  let divisionService: jasmine.SpyObj<DivisionService>;

  beforeEach(async () => {
    const divisionServiceSpy = jasmine.createSpyObj('DivisionService', ['getAllDivisions']);

    await TestBed.configureTestingModule({
      imports: [DivisionsTableComponent],
      providers: [
        { provide: DivisionService, useValue: divisionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DivisionsTableComponent);
    component = fixture.componentInstance;
    divisionService = TestBed.inject(DivisionService) as jasmine.SpyObj<DivisionService>;

    // Mock the getAllDivisions call
    divisionService.getAllDivisions.and.returnValue(of({
      data: [],
      meta: { total: 0, page: 1, limit: 100, totalPages: 0 }
    }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default filter labels', () => {
    expect(component.filterLabels.division).toBe('División:');
    expect(component.filterLabels.resetButton).toBe('Reiniciar');
    expect(component.filterLabels.applyButton).toBe('Aplicar');
  });

  it('should have default level options', () => {
    expect(component.levelOptions.length).toBe(6);
    expect(component.levelOptions[0].label).toBe('Todos los niveles');
  });

  it('should emit sortChange when onSort is called', () => {
    spyOn(component.sortChange, 'emit');
    component.onSort('name', 'asc');
    expect(component.sortChange.emit).toHaveBeenCalledWith({ column: 'name', direction: 'asc' });
  });

  it('should emit filterChange when onLevelFilter is called', () => {
    spyOn(component.filterChange, 'emit');
    component.filters = {};
    component.onLevelFilter(2);
    expect(component.filterChange.emit).toHaveBeenCalledWith({ level: 2 });
  });

  it('should emit allCheckedChange when onAllChecked is called', () => {
    spyOn(component.allCheckedChange, 'emit');
    component.onAllChecked(true);
    expect(component.allCheckedChange.emit).toHaveBeenCalledWith(true);
  });

  it('should emit itemCheckedChange when onItemChecked is called', () => {
    spyOn(component.itemCheckedChange, 'emit');
    component.onItemChecked(1, true);
    expect(component.itemCheckedChange.emit).toHaveBeenCalledWith({ id: 1, checked: true });
  });

  it('should return empty placeholder when parentId is undefined', () => {
    component.emptyValuePlaceholder = '-';
    const result = component.getParentDivisionName(undefined);
    expect(result).toBe('-');
  });

  it('should return default parent name when parent not found', () => {
    component.defaultParentName = 'Dirección general';
    component.divisions = [];
    component.parentDivisions = [];
    const result = component.getParentDivisionName(999);
    expect(result).toBe('Dirección general');
  });

  it('should get column label by key', () => {
    component.columnLabels = [
      { key: 'division', title: 'División', sortable: true, filterable: true },
      { key: 'nivel', title: 'Nivel', sortable: true, filterable: true }
    ];
    expect(component.getColumnLabel('division')).toBe('División');
    expect(component.getColumnLabel('nivel')).toBe('Nivel');
    expect(component.getColumnLabel('unknown')).toBe('unknown');
  });

  it('should clear name filter', () => {
    spyOn(component.filterChange, 'emit');
    component.nameSearchValue = 'test';
    component.filters = { searchTerm: 'test' };
    component.clearNameFilter();
    expect(component.nameSearchValue).toBe('');
    expect(component.filterChange.emit).toHaveBeenCalledWith({ searchTerm: undefined });
  });

  it('should load parent divisions on init', () => {
    component.ngOnInit();
    expect(divisionService.getAllDivisions).toHaveBeenCalledWith(1, 100);
  });
});
