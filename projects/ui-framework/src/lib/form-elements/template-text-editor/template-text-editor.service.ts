import { Injectable } from '@angular/core';

@Injectable()
export class TemplateTextEditorService {
  constructor() {}

  public convertContentToRtePlaceholderCompatible(contentToConvert: string): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert
      .replace(regex, (field: string, innerContent: string) => {
        return `<span placeholder="${innerContent}">${innerContent}</span>`;
      });
  }
}
