import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableControlsComponent } from './table-controls.component';
import { TabConfig } from '../../models/component-config.interface';

describe('TableControlsComponent', () => {
  let component: TableControlsComponent;
  let fixture: ComponentFixture<TableControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableControlsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableControlsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default viewMode as list', () => {
    expect(component.viewMode).toBe('list');
  });

  it('should emit viewModeChange when setViewMode is called', () => {
    spyOn(component.viewModeChange, 'emit');
    component.setViewMode('tree');
    expect(component.viewModeChange.emit).toHaveBeenCalledWith('tree');
    expect(component.viewMode).toBe('tree');
  });

  it('should emit tabChange when onTabClick is called', () => {
    spyOn(component.tabChange, 'emit');
    const tab: TabConfig = { label: 'Test Tab', value: 'test' };
    component.onTabClick(tab);
    expect(component.tabChange.emit).toHaveBeenCalledWith('test');
  });

  it('should render tabs from input', () => {
    const tabs: TabConfig[] = [
      { label: 'Tab 1', value: 'tab1', active: true },
      { label: 'Tab 2', value: 'tab2' }
    ];
    component.tabs = tabs;
    fixture.detectChanges();

    const tabElements = fixture.nativeElement.querySelectorAll('.tab-link');
    expect(tabElements.length).toBe(2);
    expect(tabElements[0].textContent.trim()).toBe('Tab 1');
    expect(tabElements[1].textContent.trim()).toBe('Tab 2');
  });

  it('should render view mode labels from input', () => {
    component.viewModeLabels = { list: 'Lista', tree: 'Árbol' };
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.toggle-option');
    expect(buttons[0].textContent.trim()).toBe('Lista');
    expect(buttons[1].textContent.trim()).toBe('Árbol');
  });

  it('should apply active class to current viewMode', () => {
    component.viewMode = 'tree';
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.toggle-option');
    expect(buttons[0].classList.contains('active')).toBe(false);
    expect(buttons[1].classList.contains('active')).toBe(true);
  });
});
