import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

/**
 * Filter option interface for select-type filters
 */
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
  /**
   * Filter type: "text" for search input, "select" for dropdown options
   */
  @Input() type: 'text' | 'select' = 'text';

  /**
   * Filter label/title displayed at the top of the filter dropdown
   */
  @Input() label = '';

  /**
   * Options array for select-type filters
   */
  @Input() options: FilterOption[] = [];

  /**
   * Current filter value
   */
  @Input() value: any = '';

  /**
   * Whether the filter is currently active (used to highlight the filter icon)
   */
  @Input() active = false;

  /**
   * Placeholder text for text-type filters
   */
  @Input() placeholder = 'Buscar...';

  /**
   * Label for the reset button
   */
  @Input() resetButtonLabel = 'Reiniciar';

  /**
   * Label for the apply button
   */
  @Input() applyButtonLabel = 'Aplicar';

  /**
   * Custom template for filter options (advanced usage)
   */
  @Input() customOptionsTemplate?: TemplateRef<any>;

  /**
   * Emitted when the filter value changes
   */
  @Output() filterChange = new EventEmitter<FilterChangeEvent>();

  /**
   * Emitted when the reset button is clicked
   */
  @Output() reset = new EventEmitter<void>();

  /**
   * Internal value used for two-way binding in the template
   */
  internalValue: any = '';

  /**
   * Dropdown visibility state
   */
  dropdownVisible = false;

  ngOnInit(): void {
    this.internalValue = this.value;
  }

  ngOnChanges(): void {
    this.internalValue = this.value;
  }

  /**
   * Handle option selection for select-type filters
   */
  onOptionSelect(optionValue: any): void {
    this.internalValue = optionValue;
    this.filterChange.emit({ value: optionValue, closeDropdown: false });
  }

  /**
   * Handle search for text-type filters
   */
  onSearch(): void {
    this.filterChange.emit({ value: this.internalValue, closeDropdown: true });
    this.dropdownVisible = false;
  }

  /**
   * Handle reset button click
   */
  onReset(): void {
    this.internalValue = this.type === 'text' ? '' : null;
    this.reset.emit();
    this.dropdownVisible = false;
  }

  /**
   * Handle apply button click
   */
  onApply(): void {
    if (this.type === 'text') {
      this.onSearch();
    } else {
      this.dropdownVisible = false;
    }
  }

  /**
   * Handle Enter key press in text input
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
