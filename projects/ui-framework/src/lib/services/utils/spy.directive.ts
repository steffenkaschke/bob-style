import { Directive, OnInit, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[spy]',
})
export class SpyDirective implements OnInit {
  @Input() spy: string;

  public ngOnInit(): void {
    console.log(`Spy initialized: [${this.spy}].`);
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [SpyDirective],
  exports: [SpyDirective],
  providers: [],
})
export class SpyModule {}
