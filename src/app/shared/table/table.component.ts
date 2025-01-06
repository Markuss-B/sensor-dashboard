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
  /**
   * An array of column definitions for the table.
   * Each column definition includes:
   * - `key`: The key representing the column.
   * - `label`: The display label for the column.
   * - `format` (optional): A function to format the column value.
   */
  @Input() columns: { key: string, label: string, format?: (value: any) => string }[] = [];
  /**
   * An array of data to display in the table.
   */
  @Input() data: any[] = [];
  /**
   * An array of actions as strings to display for each row.
   */
  @Input() actions: string[] = [];
  /**
   * A boolean indicating whether to show the actions
   */
  @Input() showActions: boolean = true;
  /**
   * An event emitter for when an action is clicked.
   * 
   * @returns An object with the action and row that was clicked.
   */
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

