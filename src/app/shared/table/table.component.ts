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
  @Input() columns: { key: string, label: string }[] = [];
  @Input() data: any[] = [];
  @Input() actions: string[] = [];
  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

  searchTerm: string = '';

  onActionClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  get filteredData() {
    if (!this.searchTerm) return this.data;

    return this.data.filter(row => 
      this.columns.some(col => 
        (row[col.key] ?? '').toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }
}

