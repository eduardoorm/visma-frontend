import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// NgZorro imports
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DivisionService } from '../../services/division.service';
import {
  DivisionResponseDto,
  CreateDivisionDto
} from '../../models/division.interface';

@Component({
  selector: 'app-create-division-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule
  ],
  templateUrl: './create-division-modal.component.html',
  styleUrls: ['./create-division-modal.component.scss']
})
export class CreateDivisionModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() visible = false;
  @Input() parentDivision: DivisionResponseDto | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() divisionCreated = new EventEmitter<void>();

  divisionForm!: FormGroup;
  isCreating = false;

  constructor(
    private fb: FormBuilder,
    private divisionService: DivisionService,
    private message: NzMessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Form will be initialized in constructor
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario de división
   */
  initForm(): void {
    this.divisionForm = this.fb.group({
      parentName: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      collaborators: [1, [Validators.required, Validators.min(1), Validators.max(10000)]],
      level: [{ value: 1, disabled: true }],
      ambassadorName: ['', [Validators.maxLength(100)]]
    });
  }

  /**
   * Se ejecuta cuando se abre el modal
   */
  onOpen(): void {
    if (this.parentDivision) {
      const newLevel = this.parentDivision.level + 1;
      
      // Validar que no exceda nivel 5
      if (newLevel > 5) {
        this.message.warning('No se pueden crear subdivisiones en nivel 5');
        this.handleCancel();
        return;
      }

      // Configurar el formulario para subdivisión
      this.divisionForm.patchValue({
        parentName: this.parentDivision.name,
        name: '',
        collaborators: 1,
        level: newLevel,
        ambassadorName: ''
      });
    } else {
      // Configurar el formulario para división de nivel 1 (sin padre)
      this.divisionForm.patchValue({
        parentName: 'Ninguna (División principal)',
        name: '',
        collaborators: 1,
        level: 1,
        ambassadorName: ''
      });
    }
  }

  /**
   * Maneja el cierre del modal
   */
  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.divisionForm.reset();
  }

  /**
   * Maneja la creación de la división
   */
  handleOk(): void {
    if (this.divisionForm.valid) {
      this.isCreating = true;

      const newDivision: CreateDivisionDto = {
        name: this.divisionForm.value.name,
        parentId: this.parentDivision?.id || undefined,
        collaborators: this.divisionForm.value.collaborators,
        level: this.divisionForm.get('level')?.value || (this.parentDivision ? this.parentDivision.level + 1 : 1),
        ambassadorName: this.divisionForm.value.ambassadorName || undefined
      };

      this.divisionService.createDivision(newDivision)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('División creada exitosamente');
            this.visible = false;
            this.visibleChange.emit(false);
            this.isCreating = false;
            this.divisionForm.reset();
            
            // Emitir evento para recargar la tabla
            this.divisionCreated.emit();
          },
          error: (error) => {
            console.error('Error creating division:', error);
            this.message.error('Error al crear la división. Por favor, intente nuevamente.');
            this.isCreating = false;
          }
        });
    }
  }

  /**
   * Callback cuando cambia la visibilidad del modal
   */
  onVisibleChange(visible: boolean): void {
    if (visible) {
      this.onOpen();
    } else {
      this.handleCancel();
    }
  }
}
