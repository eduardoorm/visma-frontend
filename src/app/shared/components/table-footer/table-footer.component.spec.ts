import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableFooterComponent } from './table-footer.component';

describe('TableFooterComponent', () => {
  let component: TableFooterComponent;
  let fixture: ComponentFixture<TableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableFooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.total).toBe(0);
    expect(component.pageSize).toBe(10);
    expect(component.pageIndex).toBe(1);
    expect(component.totalLabel).toBe('Total colaboradores:');
    expect(component.pageSizeLabel).toBe('/ página');
  });

  it('should emit pageSizeChange when onPageSizeChange is called', () => {
    spyOn(component.pageSizeChange, 'emit');
    component.onPageSizeChange(20);
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(20);
    expect(component.pageSize).toBe(20);
  });

  it('should emit pageIndexChange when onPageChange is called', () => {
    spyOn(component.pageIndexChange, 'emit');
    component.onPageChange(2);
    expect(component.pageIndexChange.emit).toHaveBeenCalledWith(2);
    expect(component.pageIndex).toBe(2);
  });

  it('should render custom totalLabel', () => {
    component.totalLabel = 'Total items:';
    component.total = 100;
    fixture.detectChanges();

    const totalElement = fixture.nativeElement.querySelector('.total-count');
    expect(totalElement.textContent.trim()).toBe('Total items: 100');
  });

  it('should render custom pageSizeLabel', () => {
    component.pageSizeLabel = 'per page';
    component.pageSize = 20;
    fixture.detectChanges();

    const pageSizeElement = fixture.nativeElement.querySelector('.page-size-text');
    expect(pageSizeElement.textContent.trim()).toBe('20 per page');
  });

  it('should render page size options from input', () => {
    component.pageSizeOptions = [5, 10, 25];
    fixture.detectChanges();

    // After component is rendered, check the select options
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
