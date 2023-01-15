import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMsgreplay]'
})
export class MsgreplayDirective {

  @Input('appScrollableItem') public key?: string
  constructor(private el: ElementRef<HTMLElement>) {}

  public scrollIntoView() {
    this.el.nativeElement.scrollIntoView({ behavior: 'smooth'});
  }
}
