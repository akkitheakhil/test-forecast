import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: number;
  value: number;
  label: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  value: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  ngOnInit(): void {
    this.dialogRef.backdropClick().subscribe((_) => {
      this.dialogRef.close(this.data);
    });
  }

  change() {
    this.dialogRef.close(this.data);
  }
}
