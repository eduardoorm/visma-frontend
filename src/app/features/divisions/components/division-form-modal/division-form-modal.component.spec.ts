import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DivisionFormModalComponent } from './division-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DivisionFormModalComponent', () => {
  let component: DivisionFormModalComponent;
  let fixture: ComponentFixture<DivisionFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DivisionFormModalComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DivisionFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.divisionForm).toBeDefined();
    expect(component.divisionForm.get('level')?.value).toBe(1);
    expect(component.divisionForm.get('collaborators')?.value).toBe(0);
  });

  it('should validate required name field', () => {
    const nameControl = component.divisionForm.get('name');
    expect(nameControl?.valid).toBeFalsy();
    
    nameControl?.setValue('Te');
    expect(nameControl?.valid).toBeTruthy();
  });

  it('should validate name minimum length', () => {
    const nameControl = component.divisionForm.get('name');
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBeTruthy();
  });

  it('should validate collaborators range', () => {
    const collaboratorsControl = component.divisionForm.get('collaborators');
    
    collaboratorsControl?.setValue(-1);
    expect(collaboratorsControl?.hasError('min')).toBeTruthy();
    
    collaboratorsControl?.setValue(10001);
    expect(collaboratorsControl?.hasError('max')).toBeTruthy();
    
    collaboratorsControl?.setValue(50);
    expect(collaboratorsControl?.valid).toBeTruthy();
  });

  it('should emit submitForm when form is valid and handleOk is called', () => {
    spyOn(component.submitForm, 'emit');
    
    component.divisionForm.patchValue({
      name: 'Test Division',
      level: 1,
      collaborators: 10
    });
    
    component.handleOk();
    
    expect(component.submitForm.emit).toHaveBeenCalledWith({
      name: 'Test Division',
      parentId: undefined,
      level: 1,
      collaborators: 10,
      ambassadorName: undefined
    });
  });

  it('should not emit submitForm when form is invalid', () => {
    spyOn(component.submitForm, 'emit');
    
    component.divisionForm.patchValue({
      name: '', // Invalid - required
      level: 1,
      collaborators: 10
    });
    
    component.handleOk();
    
    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });

  it('should emit visibleChange and reset form when handleCancel is called', () => {
    spyOn(component.visibleChange, 'emit');
    
    component.divisionForm.patchValue({
      name: 'Test',
      collaborators: 10
    });
    
    component.handleCancel();
    
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    expect(component.visible).toBe(false);
  });

  it('should reset form with default values', () => {
    component.divisionForm.patchValue({
      name: 'Test',
      collaborators: 50
    });
    
    component.resetForm();
    
    expect(component.divisionForm.get('level')?.value).toBe(1);
    expect(component.divisionForm.get('collaborators')?.value).toBe(0);
    expect(component.isLoading).toBe(false);
  });

  it('should reset loading state when modal closes', () => {
    component.isLoading = true;
    component.visible = true;
    
    component.ngOnChanges({
      visible: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    expect(component.isLoading).toBe(false);
  });
});
