import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterChangeEvent {
  value: any;
  closeDropdown?: boolean;
}

@Component({
  selector: 'app-table-column-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzDropDownModule,
    NzIconModule
  ],
  templateUrl: './table-column-filter.component.html',
  styleUrls: ['./table-column-filter.component.scss']
})
export class TableColumnFilterComponent {

  @Input() type: 'text' | 'select' = 'text';

  @Input() label = '';

  @Input() options: FilterOption[] = [];

  @Input() value: any = '';

  @Input() active = false;

  @Input() placeholder = 'Buscar...';

  @Input() resetButtonLabel = 'Reiniciar';

  @Input() applyButtonLabel = 'Aplicar';

  @Input() customOptionsTemplate?: TemplateRef<any>;

  @Output() filterChange = new EventEmitter<FilterChangeEvent>();

  @Output() reset = new EventEmitter<void>();

  internalValue: any = '';

  dropdownVisible = false;

  ngOnInit(): void {
    this.internalValue = this.value;
  }

  ngOnChanges(): void {
    this.internalValue = this.value;
  }

  onOptionSelect(optionValue: any): void {
    this.internalValue = optionValue;
    this.filterChange.emit({ value: optionValue, closeDropdown: false });
  }

  onSearch(): void {
    this.filterChange.emit({ value: this.internalValue, closeDropdown: true });
    this.dropdownVisible = false;
  }

  onReset(): void {
    this.internalValue = this.type === 'text' ? '' : null;
    this.reset.emit();
    this.dropdownVisible = false;
  }

  onApply(): void {
    if (this.type === 'text') {
      this.onSearch();
    } else {
      this.dropdownVisible = false;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
