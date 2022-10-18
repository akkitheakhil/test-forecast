import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appShiftIncrementValue]',
})
export class ShiftIncrementValueDirective {
  constructor(private elRef: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.shiftKey) {
      this.elRef.nativeElement.step = '10';
    } else {
      this.elRef.nativeElement.step = '1';
    }
  }
}
