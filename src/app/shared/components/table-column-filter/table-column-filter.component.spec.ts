import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnFilterComponent } from './table-column-filter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TableColumnFilterComponent', () => {
  let component: TableColumnFilterComponent;
  let fixture: ComponentFixture<TableColumnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableColumnFilterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableColumnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as text', () => {
    expect(component.type).toBe('text');
  });

  it('should initialize internalValue with value on init', () => {
    component.value = 'test value';
    component.ngOnInit();
    expect(component.internalValue).toBe('test value');
  });

  it('should emit filterChange on option select', () => {
    spyOn(component.filterChange, 'emit');
    component.type = 'select';
    component.onOptionSelect('option1');
    expect(component.filterChange.emit).toHaveBeenCalledWith({ 
      value: 'option1', 
      closeDropdown: false 
    });
  });

  it('should emit filterChange on search', () => {
    spyOn(component.filterChange, 'emit');
    component.type = 'text';
    component.internalValue = 'search term';
    component.onSearch();
    expect(component.filterChange.emit).toHaveBeenCalledWith({ 
      value: 'search term', 
      closeDropdown: true 
    });
    expect(component.dropdownVisible).toBe(false);
  });

  it('should emit reset event on reset', () => {
    spyOn(component.reset, 'emit');
    component.type = 'text';
    component.internalValue = 'some value';
    component.onReset();
    expect(component.reset.emit).toHaveBeenCalled();
    expect(component.internalValue).toBe('');
    expect(component.dropdownVisible).toBe(false);
  });

  it('should reset to null for select type', () => {
    spyOn(component.reset, 'emit');
    component.type = 'select';
    component.internalValue = 'some value';
    component.onReset();
    expect(component.reset.emit).toHaveBeenCalled();
    expect(component.internalValue).toBeNull();
  });

  it('should call onSearch on Enter key press', () => {
    spyOn(component, 'onSearch');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    component.onKeyPress(event);
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should close dropdown on apply for text type', () => {
    spyOn(component, 'onSearch');
    component.type = 'text';
    component.onApply();
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should close dropdown on apply for select type', () => {
    component.type = 'select';
    component.dropdownVisible = true;
    component.onApply();
    expect(component.dropdownVisible).toBe(false);
  });
});
