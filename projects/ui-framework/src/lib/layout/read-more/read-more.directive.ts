import {
  Directive,
  OnInit,
  Input,
  HostBinding,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ReadMoreType } from './read-more.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import {
  ResizeObserverInstance,
  WindowRef,
  WindowLike,
} from '../../services/utils/window-ref.service';

@Directive({
  selector: '[bReadMore]',
  // styleUrls: ['./read-more.directive.scss'],
})
export class ReadMoreDirective implements OnInit, OnDestroy {
  constructor(
    private windowRef: WindowRef,
    private host: ElementRef,
    private DOM: DOMhelpers
  ) {
    this.nativeWindow = this.windowRef.nativeWindow;
    this.hostEl = this.host.nativeElement;
  }

  private nativeWindow: WindowLike;
  private hostEl: HTMLElement;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserverInstance;
  private needsReadMoreButton = false;

  @Input() bReadMore = 10;

  @HostBinding('attr.data-max-lines') get getMaxLines() {
    return Math.max(this.bReadMore || 0, 10) || 999;
  }

  // @HostBinding('attr.data-readmore-type') @Input() type: ReadMoreType =
  //   ReadMoreType.regular;
  ngOnInit(): void {
    this.mutationObserver = new this.nativeWindow.MutationObserver(() => {
      console.log('mutationObserver!');
      this.checkStuff();
    });
    // this.mutationObserver.observe(this.hostEl, {
    //   childList: true,
    //   subtree: true,
    //   characterData: true,
    // });

    this.resizeObserver = new this.nativeWindow.ResizeObserver(() => {
      console.log('resizeObserver!');
      this.checkStuff();
    });
    this.resizeObserver.observe(this.hostEl);
  }

  checkStuff() {
    this.DOM.setCssProps(this.hostEl, {
      overflow: 'hidden',
    });
    Array.from(this.hostEl.children).forEach((el: HTMLElement) => {
      this.DOM.setCssProps(el, {
        'max-height': null,
      });
      this.DOM.setAttributes(el, {
        'data-max-lines': null,
      });
    });

    if (this.hostEl.offsetHeight < this.hostEl.scrollHeight) {
      console.log('needs readmore button!');
      this.needsReadMoreButton = true;

      const hostBox = this.hostEl.getBoundingClientRect();
      let childBox;

      const elementThatDoesntFit: HTMLElement = Array.from(
        this.hostEl.children
      ).find((child: HTMLElement) => {
        childBox = child.getBoundingClientRect();
        return childBox.bottom > hostBox.bottom;
      }) as HTMLElement;

      const maxHeight = hostBox.bottom - childBox.top;

      console.log(
        'elementThatDoesntFit',
        elementThatDoesntFit,
        'maxHeight',
        maxHeight
      );

      this.DOM.setCssProps(elementThatDoesntFit, {
        'max-height': maxHeight + 'px',
      });
      this.DOM.setAttributes(elementThatDoesntFit, {
        'data-max-lines': Math.floor(maxHeight / 18),
      });

      console.log('button?', this.hostEl.querySelector('.read-more-button'));

      if (
        this.needsReadMoreButton &&
        !this.hostEl.querySelector('.read-more-button')
      ) {
        const button = document.createElement('div');
        button.setAttribute('style', 'margin-top:16px');
        button.innerHTML =
          '<button class="read-more-button" type="button">Read More</button>';

        button.children[0].addEventListener('click', () => {
          console.log('read more clicked!!!');
        });

        this.hostEl.appendChild(button);

        this.DOM.setCssProps(this.hostEl, {
          overflow: 'visible',
        });
      } else {
        this.hostEl.querySelector('.read-more-button')?.parentElement.remove();
      }
    }
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
  }
}
