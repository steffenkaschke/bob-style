import { MetaData, allowedStyleObj } from './card-table.interface';

export const genId = (
  meta: MetaData,
  index: number,
  prefix: string
): string => {
  return (
    prefix +
    index +
    '_' +
    (meta[index].id ? meta[index].id : meta[index].name.replace(/\s/g, ''))
  );
};

export const checkCssUnit = (value: string): string => {
  const n = parseFloat(value),
    p = value.match(/%|em|rem/);
  return isNaN(n) ? 'auto' : p ? n + '' + p : Math.round(n) + 'px';
};

export const getCellWidth = (meta: MetaData, index: number): string | null => {
  if (!meta[index].width || meta[index].width === 'auto') {
    return null;
  }
  return this.checkCssUnit(String(meta[index].width));
};

export const getCellStyle = (
  meta: MetaData,
  index: number
): allowedStyleObj => {
  return {
    maxWidth: getCellWidth(meta, index),
    alignItems: meta[index].align === 'right' ? 'flex-end' : null,
    ...meta[index].textStyle
  };
};
