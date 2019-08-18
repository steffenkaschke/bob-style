import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[bChainSelect]'
})
export class ChainSelectDirective {
  constructor(private tpl: TemplateRef<any>) { }
}
