import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DivisionResponseDto } from '../../models/division.interface';
import { DivisionService } from '../../services/division.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-subdivisions-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './subdivisions-modal.component.html',
  styleUrls: ['./subdivisions-modal.component.scss']
})
export class SubdivisionsModalComponent implements OnChanges {
  private destroy$ = new Subject<void>();
  @Input() visible = false;
  @Input() parentDivision: DivisionResponseDto | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  subdivisions: DivisionResponseDto[] = [];
  loading = false;
  constructor(private divisionService: DivisionService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && this.parentDivision) {
      this.loadSubdivisions();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadSubdivisions(): void {
    if (!this.parentDivision) return;
    this.loading = true;
    this.divisionService.getSubdivisions(this.parentDivision.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subdivisions) => {
          this.subdivisions = subdivisions;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading subdivisions:', error);
          this.loading = false;
        }
      });
  }
  handleClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.subdivisions = [];
  }
}
