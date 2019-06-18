import { URLtype } from './url.enum';

export const allowedDomainsTest = {
  [URLtype.youtube]: /(www\.)?youtu(be\.com|\.be|be\.googleapis\.com)/i,
  [URLtype.vimeo]: /(player\.|www\.)?(vimeo\.com)/i
};

const naiveLinkTest = /(www\.|http|\/|\w+\.\w+)/i;

export const reconstructUrl = (url: string): string => {
  if (!naiveLinkTest.test(url)) {
    return undefined;
  }
  const rec = url.split(/(https?:\/\/)/i);
  return rec.length < 3
    ? `http://${rec[rec.length - 1]}`
    : `${rec[1]}${rec[2]}`;
};

export const getUrlData = (url: string): URL => {
  const rec = reconstructUrl(url);
  return rec ? new URL(reconstructUrl(url)) : undefined;
};

export const domainFromUrl = (url: string) => {
  const data = getUrlData(url);
  return data ? data.hostname : undefined;
};
