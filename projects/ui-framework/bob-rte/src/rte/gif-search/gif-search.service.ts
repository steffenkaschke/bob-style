import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { map as _map } from 'lodash';

export interface GifInterface {
  thumbNailUrl: string;
  largeUrl: string;
  largeWidth: number;
  largeHeight: number;
}
@Injectable({
  providedIn: 'root',
})
export class GifSearchService {
  constructor(private httpClient: HttpClient) {}

  searchGiphy(query: string): Observable<any[]> {
    const GIPHY_API_KEY = '7Dl0nDZVo98WDJk0fI1C0LQBHmEQOv1U';
    const giphyUrl = `//api.giphy.com/v1/stickers/search?q=${query}&api_key=${GIPHY_API_KEY}&limit=30`;

    return this.httpClient.request<{ data: any[] }>('get', giphyUrl, {}).pipe(
      map((gifImages: { data: any[] }) => {
        return _map(gifImages.data, gifObject => {
          return {
            thumbNailUrl: gifObject.images.fixed_width_small.url,
            largeUrl: gifObject.images.original.url,
            largeWidth: gifObject.images.original.width,
            largeHeight: gifObject.images.original.height,
          };
        });
      })
    );
  }
}
