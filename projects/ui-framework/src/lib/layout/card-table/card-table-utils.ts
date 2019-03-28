

import { MetaData } from './card-table.interface';

export const genId = (meta: MetaData, index: number, prefix: string): string => {
  return (
    prefix +
    index +
    '_' +
    (meta[index].id ? meta[index].id : meta[index].name.replace(/\s/g, ''))
  );
}
