import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlSanitizer } from '../../../../ui-framework/src/lib/services/url/url-sanitizer.service';
import { getUrlData } from '../../../../ui-framework/src/lib/services/url/url.const';

@Component({
  selector: 'url-tester',
  template: `
    <input #input type="text" />
    <button (click)="testUrl(input.value)" type="button">test</button>
  `,
  providers: [UrlSanitizer]
})
export class UrlTesterComponent {
  constructor(private sanitizer: UrlSanitizer) {}

  testUrl(url: string) {
    console.log(url, getUrlData(url));
    console.log(this.sanitizer.checkUrl(url));
  }
}

@NgModule({
  declarations: [UrlTesterComponent],
  imports: [CommonModule],
  exports: [UrlTesterComponent],
  providers: [],
  entryComponents: []
})
export class UrlTesterModule {}
