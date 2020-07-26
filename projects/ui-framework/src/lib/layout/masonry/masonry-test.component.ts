import { NgModule, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { InputSubject } from '../../services/utils/decorators';
import { map, delay } from 'rxjs/operators';
import { randomNumber } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-masonry-test-card',
  template: `
    <div>
      <h3>{{ title$ | async }}</h3>
      <p>{{ text$ | async }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
        border: 1px solid grey;
        box-sizing: border-box;
      }
      h3 {
        margin-top: 0;
      }
      h3 + p {
        margin: 0;
      }
    `,
  ],
})
export class MasonryTestComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @InputSubject(undefined)
  @Input('card')
  public card$: BehaviorSubject<{ title: string; text: string }>;

  title$: Observable<string>;
  text$: Observable<string>;

  ngOnInit(): void {
    this.title$ = this.card$.pipe(map((card) => card?.title));
    this.text$ = this.card$.pipe(
      delay(randomNumber() > 50 ? 0 : randomNumber(300 - 1500)),
      map((card) => card?.text)
    );
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryTestComponent],
  exports: [MasonryTestComponent],
})
export class MasonryTestModule {}
