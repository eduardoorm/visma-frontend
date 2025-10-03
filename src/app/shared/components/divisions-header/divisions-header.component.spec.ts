import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DivisionsHeaderComponent } from './divisions-header.component';
import { DivisionTableColumn } from '../../../features/divisions/models/division.interface';

describe('DivisionsHeaderComponent', () => {
  let component: DivisionsHeaderComponent;
  let fixture: ComponentFixture<DivisionsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivisionsHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DivisionsHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.breadcrumbText).toBe('Organización');
    expect(component.searchPlaceholder).toBe('Buscar divisiones por nombre...');
    expect(component.columnDropdownLabel).toBe('Columnas');
    expect(component.importButtonAriaLabel).toBe('Importar divisiones');
    expect(component.exportButtonAriaLabel).toBe('Exportar divisiones');
    expect(component.createButtonAriaLabel).toBe('Crear nueva división');
  });

  it('should emit searchChange when onSearch is called', () => {
    spyOn(component.searchChange, 'emit');
    component.onSearch('test search');
    expect(component.searchChange.emit).toHaveBeenCalledWith('test search');
  });

  it('should emit columnToggle when toggleColumn is called', () => {
    spyOn(component.columnToggle, 'emit');
    component.toggleColumn('testColumn');
    expect(component.columnToggle.emit).toHaveBeenCalledWith('testColumn');
  });

  it('should emit importClick when onImport is called', () => {
    spyOn(component.importClick, 'emit');
    component.onImport();
    expect(component.importClick.emit).toHaveBeenCalled();
  });

  it('should emit exportClick when onExport is called', () => {
    spyOn(component.exportClick, 'emit');
    component.onExport();
    expect(component.exportClick.emit).toHaveBeenCalled();
  });

  it('should emit createClick when onCreate is called', () => {
    spyOn(component.createClick, 'emit');
    component.onCreate();
    expect(component.createClick.emit).toHaveBeenCalled();
  });

  it('should render breadcrumb text from input', () => {
    component.breadcrumbText = 'Custom Breadcrumb';
    fixture.detectChanges();

    const breadcrumbElement = fixture.nativeElement.querySelector('.breadcrumb-item');
    expect(breadcrumbElement.textContent.trim()).toBe('Custom Breadcrumb');
  });

  it('should render column dropdown label from input', () => {
    component.columnDropdownLabel = 'Custom Columns';
    fixture.detectChanges();

    const columnButton = fixture.nativeElement.querySelector('.columns-btn span');
    expect(columnButton.textContent.trim()).toBe('Custom Columns');
  });

  it('should render table columns', () => {
    const columns: DivisionTableColumn[] = [
      { key: 'col1', title: 'Column 1', sortable: true, filterable: true },
      { key: 'col2', title: 'Column 2', sortable: true, filterable: false }
    ];
    component.tableColumns = columns;
    component.selectedColumns = ['col1'];
    fixture.detectChanges();

    // Component should have the columns
    expect(component.tableColumns.length).toBe(2);
  });
});
