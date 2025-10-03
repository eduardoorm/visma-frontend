import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CreateDivisionDto, DivisionResponseDto } from '../../models/division.interface';

@Component({
  selector: 'app-division-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzInputNumberModule
  ],
  templateUrl: './division-form-modal.component.html',
  styleUrls: ['./division-form-modal.component.scss']
})
export class DivisionFormModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() parentDivisions: DivisionResponseDto[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<CreateDivisionDto>();

  divisionForm!: FormGroup;
  isLoading = false;

  levelOptions = [
    { label: 'Nivel 1', value: 1 },
    { label: 'Nivel 2', value: 2 },
    { label: 'Nivel 3', value: 3 },
    { label: 'Nivel 4', value: 4 },
    { label: 'Nivel 5', value: 5 }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When modal is closed from parent, reset the form
    if (changes['visible'] && !changes['visible'].currentValue && changes['visible'].previousValue) {
      this.resetForm();
    }
  }

  initForm(): void {
    this.divisionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      parentId: [null],
      level: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      collaborators: [0, [Validators.required, Validators.min(0)]],
      ambassadorName: ['']
    });
  }

  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  handleOk(): void {
    if (this.divisionForm.valid) {
      this.isLoading = true;
      const formValue = this.divisionForm.value;
      const divisionData: CreateDivisionDto = {
        name: formValue.name,
        parentId: formValue.parentId || undefined,
        level: formValue.level,
        collaborators: formValue.collaborators,
        ambassadorName: formValue.ambassadorName || undefined
      };
      this.submitForm.emit(divisionData);
    } else {
      Object.values(this.divisionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  resetForm(): void {
    this.divisionForm.reset({
      level: 1,
      collaborators: 0
    });
    this.isLoading = false;
  }
}
