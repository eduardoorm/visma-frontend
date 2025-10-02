import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss']
})
export class TableControlsComponent {
  @Input() viewMode: 'list' | 'tree' = 'list';
  @Output() viewModeChange = new EventEmitter<'list' | 'tree'>();

  setViewMode(mode: 'list' | 'tree'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }
}
