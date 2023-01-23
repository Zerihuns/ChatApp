import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTextareaAutoresizeDirective]'
})
export class TextareaAutoresizeDirectiveDirective {
  constructor(private elementRef: ElementRef) {
  }

  @HostListener(':input')
  onInput() {
    if (this.elementRef.nativeElement.scrollHeight < 100)
      this.resize();
  }
  @HostListener(':keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if((event.key == "Enter" || event.keyCode == 10) && event.ctrlKey){
      this.elementRef.nativeElement.value = ''
      this.elementRef.nativeElement.style.height = '0px'
    }
  }

  ngOnInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  resize() {
    this.elementRef.nativeElement.style.height = '0px'
    this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
  }

}
///
