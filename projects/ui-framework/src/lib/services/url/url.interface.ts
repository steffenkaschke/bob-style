import { URLtype } from './url.enum';

export interface VideoData {
  type: URLtype;
  url: string;
  thumbnail: string;
}
