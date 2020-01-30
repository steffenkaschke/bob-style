import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { GifInterface, GifSearchService } from './gif-search.service';
import { Observable, of } from 'rxjs';
import { SearchComponent } from '../../../../src/public_api';

@Component({
  selector: 'b-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifSearchComponent implements OnInit {
  constructor(
    private gifSearchService: GifSearchService,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('search', { static: false })
  public search: SearchComponent;

  @Output() gifSelected: EventEmitter<string> = new EventEmitter<string>();

  gifQuery: string;
  gifImages$: Observable<GifInterface[]>;

  ngOnInit() {
    this.gifQuery = '';
  }

  searchGiphy(event) {
    this.gifImages$ = this.gifSearchService.searchGiphy(event);
  }

  selectGif(gifImage: GifInterface) {
    this.gifSelected.emit(gifImage.thumbNailUrl);
    this.gifImages$ = of([]);
    this.gifQuery = '';
    this.search.onResetClick();
    this.cd.detectChanges();
  }
}
