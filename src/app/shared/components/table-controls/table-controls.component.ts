import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabConfig } from '../../models/component-config.interface';

@Component({
  selector: 'app-table-controls',
  standalone: true,
  imports: [CommonModule],
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

  @Output() viewModeChange = new EventEmitter<'list' | 'tree'>();
  @Output() tabChange = new EventEmitter<string>();

  setViewMode(mode: 'list' | 'tree'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }

  onTabClick(tab: TabConfig): void {
    this.tabChange.emit(tab.value);
  }
}
