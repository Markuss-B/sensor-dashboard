import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns: { key: string, label: string, format?: (value: any) => string }[] = [];
  @Input() data: any[] = [];
  @Input() actions: string[] = [];
  @Input() showActions: boolean = true;
  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

  searchTerm: string = '';

  onActionClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  /**
   * Filter data based on search term
   */
  get filteredData() {
    if (!this.searchTerm) return this.data;

    return this.data.filter(row => 
      this.columns.some(col => 
        (row[col.key] ?? '').toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  isArray(value: any) {
    return Array.isArray(value);
  }

  /**
   * Formats the cell value according to the column format function
   */
  formatCell(value: any, format?: (value: any) => string) {
    return format ? format(value) : value;
  }
}

