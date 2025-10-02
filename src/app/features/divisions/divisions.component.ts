import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionsTableComponent } from './components/divisions-table/divisions-table.component';

@Component({
  selector: 'app-divisions',
  standalone: true,
  imports: [
    CommonModule,
    DivisionsTableComponent
  ],
  template: `
    <div class="divisions-page">
      <app-divisions-table></app-divisions-table>
    </div>
  `,
  styles: [`
    .divisions-page {
      min-height: 100vh;
      background-color: #F9F9F9;
    }
  `]
})
export class DivisionsComponent {}
