import {
  Component,
  Input,
  ElementRef,
  HostListener,
  SimpleChanges,
  OnChanges,
  HostBinding,
} from '@angular/core';
import { SanitizerService } from '../../services/utils/sanitizer.service';
import { Router } from '@angular/router';
import { SelectGroupOption } from '../../lists/list.interface';
import { hasChanges } from '../../services/utils/functional-utils';
import { PlaceholdersConverterService } from '../../../../bob-rte/src/rte/placeholders.service';
import { RteViewType } from './rte-view.enum';

@Component({
  selector: 'b-rich-text-view',
  template: ``,
  styleUrls: ['./rte-view.component.scss'],
})
export class RteViewComponent implements OnChanges {
  constructor(
    private host: ElementRef,
    private sanitizer: SanitizerService,
    private router: Router,
    private placeholdersConverter: PlaceholdersConverterService
  ) {
    this.hostEl = this.host.nativeElement as HTMLElement;
  }

  private hostEl: HTMLElement;

  @Input() placeholderList: SelectGroupOption[];
  @Input() value: string;

  @HostBinding('attr.data-type') @Input() type: RteViewType;
  @HostBinding('class.fr-view') frViewClass = true;

  @HostListener('click', ['$event'])
  onHostClick($event: MouseEvent) {
    const employeeId = ($event.target as HTMLElement).getAttribute(
      'mention-employee-id'
    );

    if (employeeId) {
      $event.preventDefault();
      this.router.navigate(['/employee-profile', employeeId]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, null, true)) {
      const sanitized = this.sanitizer.sanitizeHtml(this.value);

      this.hostEl.innerHTML = !this.value
        ? ''
        : this.placeholderList
        ? this.placeholdersConverter.toRte(
            sanitized,
            this.placeholderList,
            'viewer'
          )
        : sanitized;
    }
  }
}
