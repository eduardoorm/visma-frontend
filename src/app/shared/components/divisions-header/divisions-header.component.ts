import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DivisionTableColumn } from '../../../features/divisions/models/division.interface';

@Component({
  selector: 'app-divisions-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzCheckboxModule
  ],
  templateUrl: './divisions-header.component.html',
  styleUrls: ['./divisions-header.component.scss']
})
export class DivisionsHeaderComponent {
  @Input() searchValue = '';
  @Input() tableColumns: DivisionTableColumn[] = [];
  @Input() selectedColumns: string[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() columnToggle = new EventEmitter<string>();
  @Output() importClick = new EventEmitter<void>();
  @Output() exportClick = new EventEmitter<void>();
  @Output() createClick = new EventEmitter<void>();

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }

  toggleColumn(columnKey: string): void {
    this.columnToggle.emit(columnKey);
  }

  onImport(): void {
    this.importClick.emit();
  }

  onExport(): void {
    this.exportClick.emit();
  }

  onCreate(): void {
    this.createClick.emit();
  }
}
