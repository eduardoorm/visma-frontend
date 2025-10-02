import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabConfig } from '../../models/component-config.interface';
import { DivisionTableColumn } from '../../../features/divisions/models/division.interface';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-table-controls',
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
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss']
})
export class TableControlsComponent {
  @Input() viewMode: 'list' | 'tree' = 'list';
  @Input() tabs: TabConfig[] = [];
  @Input() viewModeLabels = {
    list: 'Listado',
    tree: 'Árbol'
  };
  @Input() columnDropdownLabel = 'Columnas';
  @Input() tableColumns: DivisionTableColumn[] = [];
  @Input() selectedColumns: string[] = [];
  @Input() searchPlaceholder = 'Buscar divisiones por nombre...';
  @Input() searchValue = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() columnToggle = new EventEmitter<string>();
  @Output() importClick = new EventEmitter<void>();
  @Output() exportClick = new EventEmitter<void>();
  @Output() createClick = new EventEmitter<void>();
  @Output() viewModeChange = new EventEmitter<'list' | 'tree'>();
  @Output() tabChange = new EventEmitter<string>();

  setViewMode(mode: 'list' | 'tree'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }

  toggleColumn(columnKey: string): void {
    this.columnToggle.emit(columnKey);
  }

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }

  onTabClick(tab: TabConfig): void {
    this.tabChange.emit(tab.value);
  }
}
